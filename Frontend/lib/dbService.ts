const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface DbCategory {
  id: string;
  title: string;
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

export interface DbCustomerReview {
  id: string;
  name: string;
  phone?: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
}

export interface DbFeedback {
  id: string;
  name: string;
  phone: string;
  type: "suggestion" | "complaint";
  message: string;
  is_read: boolean;
  created_at?: string;
}

// ----------------------------------------------------
// 0. HEALTH / CONNECTION CHECK
// ----------------------------------------------------
export async function checkServerConnection(): Promise<{ connected: boolean; message?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/health`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { connected: data.status === "ok" };
    }
    return { connected: false, message: `Server error status: ${res.status}` };
  } catch (err: any) {
    return { connected: false, message: err.message || "Connection refused" };
  }
}

// ----------------------------------------------------
// 0. CLOUDINARY IMAGE UPLOAD HELPER
// ----------------------------------------------------
export async function uploadImageToCloudinary(file: File, folder = "new-portsaid"): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Upload failed with status ${res.status}`);
  }

  const data = await res.json();
  if (!data.success || !data.url) {
    throw new Error(data.message || "Failed to retrieve uploaded image URL");
  }

  return data.url;
}

// ----------------------------------------------------
// 1. FETCH FULL MENU WITH CATEGORIES AND ITEMS
// ----------------------------------------------------
export async function getMenuCategoriesWithItems(): Promise<DbCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/menu/full`, {
      cache: "no-store",
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Backend getMenuCategoriesWithItems fetch error:", err);
  }

  return [];
}

// ----------------------------------------------------
// 2. FETCH RESTAURANT SETTINGS
// ----------------------------------------------------
export async function getRestaurantSettings(): Promise<DbRestaurantSettings> {
  const defaultSettings: DbRestaurantSettings = {
    name: "مطعم نيو بورسعيد",
    name_en: "New Port Said Restaurant",
    tagline: "أصالة الطعم البورسعيدي والمشويات على الفحم",
    phones: ["01007375151", "01100130080"],
    address: "سوهاج - سيتي - أمام مدرسة الأرقم",
    whatsapp: "201007375151",
    working_hours: "يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً",
    facebook_url: "https://facebook.com",
    instagram_url: "https://instagram.com",
  };

  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      cache: "no-store",
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return {
          id: result.data.id || "default_settings",
          name: result.data.name || defaultSettings.name,
          name_en: result.data.name_en || defaultSettings.name_en,
          tagline: result.data.tagline || defaultSettings.tagline,
          phones: result.data.phones || defaultSettings.phones,
          address: result.data.address || defaultSettings.address,
          whatsapp: result.data.whatsapp || defaultSettings.whatsapp,
          working_hours: result.data.working_hours || defaultSettings.working_hours,
          facebook_url: result.data.facebook_url || defaultSettings.facebook_url,
          instagram_url: result.data.instagram_url || defaultSettings.instagram_url,
        };
      }
    }
  } catch (err) {
    console.warn("Backend getRestaurantSettings fetch error:", err);
  }

  return defaultSettings;
}

// ----------------------------------------------------
// 3. UPSERT / UPDATE RESTAURANT SETTINGS
// ----------------------------------------------------
export async function updateRestaurantSettings(settings: Partial<DbRestaurantSettings>) {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update restaurant settings");
  }

  const result = await res.json();
  return result.data;
}

// ----------------------------------------------------
// 4. ADD OR UPDATE MENU ITEM
// ----------------------------------------------------
export async function upsertMenuItem(item: Partial<DbMenuItem> & { name: string; category_id: string }) {
  const res = await fetch(`${API_BASE_URL}/menu/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to save menu item");
  }

  const result = await res.json();
  return result.data;
}

// ----------------------------------------------------
// 5. DELETE MENU ITEM
// ----------------------------------------------------
export async function deleteMenuItem(itemId: string) {
  const res = await fetch(`${API_BASE_URL}/menu/items/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete menu item");
  }

  return true;
}

// ----------------------------------------------------
// 6. ADD OR UPDATE CATEGORY
// ----------------------------------------------------
export async function upsertCategory(category: Partial<DbCategory> & { title: string }) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to save category");
  }

  const result = await res.json();
  return result.data;
}

// ----------------------------------------------------
// 7. DELETE CATEGORY
// ----------------------------------------------------
export async function deleteCategory(categoryId: string) {
  const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(categoryId)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete category");
  }

  return true;
}

// ----------------------------------------------------
// 8. 1-CLICK DATABASE SEEDING
// ----------------------------------------------------
export async function seedDatabaseFromDataJS(): Promise<{ success: boolean; categoriesCount: number; itemsCount: number; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/seed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to seed database");
    }

    const result = await res.json();
    return {
      success: true,
      categoriesCount: result.categoriesCount,
      itemsCount: result.itemsCount,
      message: result.message || `تم بنجاح نقل وحفظ ${result.categoriesCount} قسماً و ${result.itemsCount} صنفاً إلى MongoDB!`,
    };
  } catch (err: any) {
    console.error("Seeding Error:", err);
    throw new Error(err?.message || "حدث خطأ أثناء نقل وحفظ البيانات في MongoDB.");
  }
}

// ----------------------------------------------------
// 9. DATABASE STATS & CONNECTION HEALTH
// ----------------------------------------------------
export async function getBackendStats(): Promise<{
  connected: boolean;
  stats?: { categories: number; menuItems: number; reviews: number; feedback: number };
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/seed/stats`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return {
        connected: Boolean(data.connected),
        stats: data.stats,
      };
    }
  } catch (err) {
    console.warn("Could not fetch backend stats:", err);
  }

  return { connected: false };
}

// ----------------------------------------------------
// 10. CUSTOMER REVIEWS (SUBMIT, APPROVE, REJECT, DELETE)
// ----------------------------------------------------

const LOCAL_REVIEWS_KEY = "new_portsaid_customer_reviews";

function getLocalReviews(): DbCustomerReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReviews(reviews: DbCustomerReview[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error(e);
  }
}

export async function submitCustomerReview(review: Omit<DbCustomerReview, "id" | "status" | "created_at">): Promise<DbCustomerReview> {
  const newReviewFallback: DbCustomerReview = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: review.name.trim(),
    phone: review.phone?.trim() || "",
    rating: Number(review.rating) || 5,
    comment: review.comment.trim(),
    status: "pending",
    created_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Backend submit review failed, using local storage fallback:", err);
  }

  // Fallback to local storage
  const current = getLocalReviews();
  saveLocalReviews([newReviewFallback, ...current]);
  return newReviewFallback;
}

export async function getApprovedCustomerReviews(): Promise<DbCustomerReview[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/approved`, {
      cache: "no-store",
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Backend fetch approved reviews error:", err);
  }

  // Fallback
  return getLocalReviews().filter((r) => r.status === "approved");
}

export async function getAllCustomerReviewsAdmin(): Promise<DbCustomerReview[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/all`, {
      cache: "no-store",
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Backend fetch all reviews error:", err);
  }

  return getLocalReviews();
}

export async function updateReviewStatus(reviewId: string, status: "approved" | "rejected" | "pending"): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/${encodeURIComponent(reviewId)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const current = getLocalReviews().map((r) => (r.id === reviewId ? { ...r, status } : r));
      saveLocalReviews(current);
      return true;
    }
  } catch (err) {
    console.warn("Backend update review error:", err);
  }

  const current = getLocalReviews().map((r) => (r.id === reviewId ? { ...r, status } : r));
  saveLocalReviews(current);
  return true;
}

export async function deleteCustomerReview(reviewId: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE_URL}/reviews/${encodeURIComponent(reviewId)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Backend delete review error:", err);
  }

  const current = getLocalReviews().filter((r) => r.id !== reviewId);
  saveLocalReviews(current);
  return true;
}

// ----------------------------------------------------
// 11. SUGGESTIONS & COMPLAINTS (FEEDBACK)
// ----------------------------------------------------

const LOCAL_FEEDBACK_KEY = "new_portsaid_customer_feedback";

function getLocalFeedback(): DbFeedback[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalFeedback(feedbackList: DbFeedback[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(feedbackList));
  } catch (e) {
    console.error(e);
  }
}

export async function submitCustomerFeedback(feedback: Omit<DbFeedback, "id" | "is_read" | "created_at">): Promise<DbFeedback> {
  const newFeedbackFallback: DbFeedback = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: feedback.name.trim(),
    phone: feedback.phone.trim(),
    type: feedback.type,
    message: feedback.message.trim(),
    is_read: false,
    created_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Backend submit feedback failed, using local storage fallback:", err);
  }

  const current = getLocalFeedback();
  saveLocalFeedback([newFeedbackFallback, ...current]);
  return newFeedbackFallback;
}

export async function getAllFeedbackAdmin(): Promise<DbFeedback[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/feedback/all`, {
      cache: "no-store",
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Backend fetch feedback error:", err);
  }

  return getLocalFeedback();
}

export async function markFeedbackAsRead(feedbackId: string, is_read = true): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/feedback/${encodeURIComponent(feedbackId)}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read }),
    });

    if (res.ok) {
      const current = getLocalFeedback().map((f) => (f.id === feedbackId ? { ...f, is_read } : f));
      saveLocalFeedback(current);
      return true;
    }
  } catch (err) {
    console.warn("Backend mark feedback error:", err);
  }

  const current = getLocalFeedback().map((f) => (f.id === feedbackId ? { ...f, is_read } : f));
  saveLocalFeedback(current);
  return true;
}

export async function deleteFeedback(feedbackId: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE_URL}/feedback/${encodeURIComponent(feedbackId)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Backend delete feedback error:", err);
  }

  const current = getLocalFeedback().filter((f) => f.id !== feedbackId);
  saveLocalFeedback(current);
  return true;
}
