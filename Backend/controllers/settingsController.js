const RestaurantSettings = require("../models/RestaurantSettings");

// @desc    Get restaurant settings
// @route   GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await RestaurantSettings.findOne({ id: "default_settings" });

    if (!settings) {
      settings = await RestaurantSettings.create({ id: "default_settings" });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update restaurant settings
// @route   PUT /api/settings
exports.updateSettings = async (req, res) => {
  try {
    const updateData = { ...req.body, id: "default_settings" };

    const settings = await RestaurantSettings.findOneAndUpdate(
      { id: "default_settings" },
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
