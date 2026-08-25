import { supabase } from "./supabase";
import { MENU_DATA, RESTAURANT_INFO } from "./data.js";

export interface DbCategory {
  id: string;
  title: string;
  titleEn?: string;
  image: string;
  description: string;
  icon?: string;
  display_order?: number;
  items?: DbMenuItem[];
}

export interface DbMenuItem {
  id: string;
  category_id: string;
  name: string;
  price: number | string;
  is_daily?: boolean;
  badge?: string;
  description?: string;
  image?: string;
  is_available?: boolean;
  display_order?: number;
}

export interface DbRestaurantSettings {
  id?: string;
  name: string;
  name_en: string;
  tagline: string;
  phones: string[];
  address: string;
  whatsapp: string;
  working_hours: string;
  facebook_url: string;
  instagram_url: string;
}

// 1. Fetch Full Menu with Categories and Items
export async function getMenuCategoriesWithItems(): Promise<DbCategory[]> {
  try {
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (catError || !categories || categories.length === 0) {
      console.warn("Using fallback local MENU_DATA:", catError?.message);
      return MENU_DATA as unknown as DbCategory[];
    }

    const { data: items, error: itemError } = await supabase
      .from("menu_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (itemError) {
      console.warn("Failed to fetch menu_items, using fallback items:", itemError.message);
      return MENU_DATA as unknown as DbCategory[];
    }

    // Merge items into their respective categories
    return categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      titleEn: cat.title_en || "",
      image: cat.image || "",
      description: cat.description || "",
      icon: cat.icon || "Flame",
      display_order: cat.display_order,
      items: (items || [])
        .filter((item) => item.category_id === cat.id)
        .map((item) => ({
          id: item.id,
          category_id: item.category_id,
          name: item.name,
          price: item.is_daily ? "يومي" : Number(item.price),
          is_daily: item.is_daily,
          badge: item.badge,
          description: item.description,
          image: item.image,
          is_available: item.is_available ?? true,
          display_order: item.display_order,
        })),
    }));
  } catch (err) {
    console.error("Supabase getMenuCategoriesWithItems error:", err);
    return MENU_DATA as unknown as DbCategory[];
  }
}

// 2. Fetch Restaurant Settings
export async function getRestaurantSettings(): Promise<DbRestaurantSettings> {
  try {
    const { data, error } = await supabase
      .from("restaurant_settings")
      .select("*")
      .single();

    if (error || !data) {
      return {
        name: RESTAURANT_INFO.name,
        name_en: RESTAURANT_INFO.nameEn,
        tagline: RESTAURANT_INFO.tagline,
        phones: RESTAURANT_INFO.phones,
        address: RESTAURANT_INFO.address,
        whatsapp: RESTAURANT_INFO.whatsapp,
        working_hours: "يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً",
        facebook_url: "https://facebook.com",
        instagram_url: "https://instagram.com",
      };
    }

    return {
      id: data.id,
      name: data.name || RESTAURANT_INFO.name,
      name_en: data.name_en || RESTAURANT_INFO.nameEn,
      tagline: data.tagline || RESTAURANT_INFO.tagline,
      phones: data.phones || RESTAURANT_INFO.phones,
      address: data.address || RESTAURANT_INFO.address,
      whatsapp: data.whatsapp || RESTAURANT_INFO.whatsapp,
      working_hours: data.working_hours || "يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً",
      facebook_url: data.facebook_url || "https://facebook.com",
      instagram_url: data.instagram_url || "https://instagram.com",
    };
  } catch (err) {
    console.error("Supabase getRestaurantSettings error:", err);
    return {
      name: RESTAURANT_INFO.name,
      name_en: RESTAURANT_INFO.nameEn,
      tagline: RESTAURANT_INFO.tagline,
      phones: RESTAURANT_INFO.phones,
      address: RESTAURANT_INFO.address,
      whatsapp: RESTAURANT_INFO.whatsapp,
      working_hours: "يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً",
      facebook_url: "https://facebook.com",
      instagram_url: "https://instagram.com",
    };
  }
}

// 3. Upsert / Update Restaurant Settings
export async function updateRestaurantSettings(settings: Partial<DbRestaurantSettings>) {
  const { data, error } = await supabase
    .from("restaurant_settings")
    .upsert({
      id: "default_settings",
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 4. Add or Update Menu Item
export async function upsertMenuItem(item: Partial<DbMenuItem> & { name: string; category_id: string }) {
  const isDaily = item.price === "يومي" || item.is_daily;
  const numericPrice = typeof item.price === "number" ? item.price : Number(item.price) || 0;
  const itemId = item.id && item.id.trim().length > 0
    ? item.id.trim()
    : `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Ensure category exists to prevent foreign key violation
  try {
    const { data: existingCat } = await supabase
      .from("categories")
      .select("id")
      .eq("id", item.category_id)
      .maybeSingle();

    if (!existingCat) {
      await supabase.from("categories").insert({
        id: item.category_id,
        title: item.category_id,
        description: "",
        display_order: 99,
      });
    }
  } catch (catErr) {
    console.warn("Category check warning:", catErr);
  }

  const { data, error } = await supabase
    .from("menu_items")
    .upsert({
      id: itemId,
      category_id: item.category_id,
      name: item.name,
      price: numericPrice,
      is_daily: isDaily,
      badge: item.badge || null,
      description: item.description || "",
      image: item.image || null,
      is_available: item.is_available ?? true,
      display_order: item.display_order || 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase upsertMenuItem error:", error);
    throw error;
  }
  return data;
}

// 5. Delete Menu Item
export async function deleteMenuItem(itemId: string) {
  const { error } = await supabase.from("menu_items").delete().eq("id", itemId);
  if (error) throw error;
  return true;
}

// 6. Add or Update Category
export async function upsertCategory(category: Partial<DbCategory> & { title: string }) {
  const catId = category.id || `cat_${Date.now()}`;
  const { data, error } = await supabase
    .from("categories")
    .upsert({
      id: catId,
      title: category.title,
      title_en: category.titleEn || "",
      image: category.image || "",
      description: category.description || "",
      icon: category.icon || "Flame",
      display_order: category.display_order || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 7. Delete Category
export async function deleteCategory(categoryId: string) {
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw error;
  return true;
}

// 8. 1-Click Database Seeding from data.js
export async function seedDatabaseFromDataJS(): Promise<{ success: boolean; categoriesCount: number; itemsCount: number; message: string }> {
  try {
    let catCount = 0;
    let itemCount = 0;

    // 1. Seed Settings
    await updateRestaurantSettings({
      name: RESTAURANT_INFO.name,
      name_en: RESTAURANT_INFO.nameEn,
      tagline: RESTAURANT_INFO.tagline,
      phones: RESTAURANT_INFO.phones,
      address: RESTAURANT_INFO.address,
      whatsapp: RESTAURANT_INFO.whatsapp,
      working_hours: "يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً",
      facebook_url: "https://facebook.com",
      instagram_url: "https://instagram.com",
    });

    // 2. Seed Categories & Items
    for (let i = 0; i < MENU_DATA.length; i++) {
      const cat = MENU_DATA[i];
      await upsertCategory({
        id: cat.id,
        title: cat.title,
        titleEn: cat.titleEn,
        image: cat.image,
        description: cat.description,
        icon: cat.icon,
        display_order: i,
      });
      catCount++;

      for (let j = 0; j < cat.items.length; j++) {
        const itm: any = cat.items[j];
        await upsertMenuItem({
          id: itm.id,
          category_id: cat.id,
          name: itm.name,
          price: itm.price,
          is_daily: itm.isDaily || itm.price === "يومي",
          badge: itm.badge,
          description: itm.description,
          image: (cat as any).image,
          is_available: true,
          display_order: j,
        });
        itemCount++;
      }
    }

    return {
      success: true,
      categoriesCount: catCount,
      itemsCount: itemCount,
      message: `تم بنجاح نقل وحفظ ${catCount} قسماً و ${itemCount} صنفاً إلى Supabase!`,
    };
  } catch (err: any) {
    console.error("Seeding Error:", err);
    throw new Error(err?.message || "حدث خطأ أثناء نقل البيانات إلى Supabase. تأكد من تشغيل سكربت schema.sql في Supabase أولاً.");
  }
}
