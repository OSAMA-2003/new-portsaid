const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ display_order: 1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or Update Category
// @route   POST /api/categories
exports.upsertCategory = async (req, res) => {
  try {
    const { id, title, image, description, icon, display_order } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Category title is required" });
    }

    const categoryId = id && id.trim().length > 0 ? id.trim() : `cat_${Date.now()}`;

    const category = await Category.findOneAndUpdate(
      { id: categoryId },
      {
        id: categoryId,
        title: title.trim(),
        image: image || "",
        description: description || "",
        icon: icon || "Flame",
        display_order: display_order !== undefined ? Number(display_order) : 0,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Category and all its menu items
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndDelete({ id });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Cascade delete items belonging to this category
    const deletedItems = await MenuItem.deleteMany({ category_id: id });

    res.json({
      success: true,
      message: `Category and ${deletedItems.deletedCount} items deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
