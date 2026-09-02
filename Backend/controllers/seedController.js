const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const RestaurantSettings = require("../models/RestaurantSettings");
const Review = require("../models/Review");
const Feedback = require("../models/Feedback");
const { RESTAURANT_INFO, MENU_DATA } = require("../data/defaultData");

// @desc    Seed MongoDB with default restaurant data
// @route   POST /api/seed
exports.seedDatabase = async (req, res) => {
  try {
    let catCount = 0;
    let itemCount = 0;

    // 1. Seed Restaurant Settings
    await RestaurantSettings.findOneAndUpdate(
      { id: "default_settings" },
      {
        id: "default_settings",
        name: RESTAURANT_INFO.name,
        name_en: RESTAURANT_INFO.nameEn,
        tagline: RESTAURANT_INFO.tagline,
        phones: RESTAURANT_INFO.phones,
        address: RESTAURANT_INFO.address,
        whatsapp: RESTAURANT_INFO.whatsapp,
        working_hours: RESTAURANT_INFO.working_hours,
        facebook_url: RESTAURANT_INFO.facebook_url,
        instagram_url: RESTAURANT_INFO.instagram_url,
      },
      { upsert: true, new: true }
    );

    // 2. Seed Categories & Menu Items
    for (let i = 0; i < MENU_DATA.length; i++) {
      const cat = MENU_DATA[i];

      await Category.findOneAndUpdate(
        { id: cat.id },
        {
          id: cat.id,
          title: cat.title,
          image: cat.image || "",
          description: cat.description || "",
          icon: cat.icon || "Flame",
          display_order: i,
        },
        { upsert: true, new: true }
      );
      catCount++;

      for (let j = 0; j < (cat.items || []).length; j++) {
        const itm = cat.items[j];
        const isDaily = itm.price === "يومي" || itm.isDaily;
        const numericPrice = typeof itm.price === "number" ? itm.price : Number(itm.price) || 0;

        await MenuItem.findOneAndUpdate(
          { id: itm.id },
          {
            id: itm.id,
            category_id: cat.id,
            name: itm.name,
            price: numericPrice,
            is_daily: isDaily,
            badge: itm.badge || "",
            description: itm.description || "",
            image: cat.image || "",
            is_available: true,
            display_order: j,
          },
          { upsert: true, new: true }
        );
        itemCount++;
      }
    }

    res.status(200).json({
      success: true,
      categoriesCount: catCount,
      itemsCount: itemCount,
      message: `تم بنجاح نقل وحفظ ${catCount} قسماً و ${itemCount} صنفاً في قاعدة بيانات MongoDB!`,
    });
  } catch (error) {
    console.error("Database seed error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Database Stats (Collection Counts)
// @route   GET /api/seed/stats
exports.getDatabaseStats = async (req, res) => {
  try {
    const [categoriesCount, itemsCount, reviewsCount, feedbackCount] = await Promise.all([
      Category.countDocuments(),
      MenuItem.countDocuments(),
      Review.countDocuments(),
      Feedback.countDocuments(),
    ]);

    res.json({
      success: true,
      connected: true,
      stats: {
        categories: categoriesCount,
        menuItems: itemsCount,
        reviews: reviewsCount,
        feedback: feedbackCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, connected: false, message: error.message });
  }
};
