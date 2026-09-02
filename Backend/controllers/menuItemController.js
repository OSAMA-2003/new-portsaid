const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");

// @desc    Get full menu with categories and items grouped
// @route   GET /api/menu/full
exports.getMenuWithCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ display_order: 1 }).lean();
    const items = await MenuItem.find().sort({ display_order: 1 }).lean();

    const merged = categories.map((cat) => {
      const categoryItems = items
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
        }));

      return {
        id: cat.id,
        title: cat.title,
        image: cat.image || "",
        description: cat.description || "",
        icon: cat.icon || "Flame",
        display_order: cat.display_order,
        items: categoryItems,
      };
    });

    res.json({ success: true, count: merged.length, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all menu items or filter by category
// @route   GET /api/menu/items
exports.getMenuItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category_id) {
      filter.category_id = req.query.category_id;
    }

    const items = await MenuItem.find(filter).sort({ display_order: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or Update Menu Item
// @route   POST /api/menu/items
exports.upsertMenuItem = async (req, res) => {
  try {
    const {
      id,
      category_id,
      name,
      price,
      is_daily,
      badge,
      description,
      image,
      is_available,
      display_order,
    } = req.body;

    if (!name || !category_id) {
      return res.status(400).json({
        success: false,
        message: "Item name and category_id are required",
      });
    }

    // Ensure category exists to maintain integrity
    const categoryExists = await Category.findOne({ id: category_id });
    if (!categoryExists) {
      await Category.create({
        id: category_id,
        title: category_id,
        display_order: 99,
      });
    }

    const itemId = id && id.trim().length > 0
      ? id.trim()
      : `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const isDaily = price === "يومي" || Boolean(is_daily);
    const numericPrice = typeof price === "number" ? price : Number(price) || 0;

    const item = await MenuItem.findOneAndUpdate(
      { id: itemId },
      {
        id: itemId,
        category_id,
        name: name.trim(),
        price: numericPrice,
        is_daily: isDaily,
        badge: badge || "",
        description: description || "",
        image: image || "",
        is_available: is_available !== undefined ? Boolean(is_available) : true,
        display_order: display_order !== undefined ? Number(display_order) : 0,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Menu Item
// @route   DELETE /api/menu/items/:id
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findOneAndDelete({ id });

    if (!item) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    res.json({ success: true, message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
