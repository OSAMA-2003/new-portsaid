const mongoose = require("mongoose");

const RestaurantSettingsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "default_settings",
      unique: true,
    },
    name: {
      type: String,
      default: "مطعم نيو بورسعيد",
    },
    name_en: {
      type: String,
      default: "New Port Said Restaurant",
    },
    tagline: {
      type: String,
      default: "أكل بشوات • طعم أصيل يُشوى بشغف",
    },
    phones: {
      type: [String],
      default: ["01007375151", "01100130080", "01008329497"],
    },
    address: {
      type: String,
      default: "سوهاج الجديدة - مول ريتاج 1",
    },
    whatsapp: {
      type: String,
      default: "201007375151",
    },
    working_hours: {
      type: String,
      default: "يومياً من ١٢:٠٠ ظهراً حتى ٠٢:٠٠ صباحاً",
    },
    facebook_url: {
      type: String,
      default: "https://facebook.com",
    },
    instagram_url: {
      type: String,
      default: "https://instagram.com",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RestaurantSettings", RestaurantSettingsSchema);
