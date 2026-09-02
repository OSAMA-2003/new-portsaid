const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category_id: {
      type: String,
      required: [true, "Category ID is required"],
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    is_daily: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    display_order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);
