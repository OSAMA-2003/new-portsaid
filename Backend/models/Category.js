const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "Flame",
    },
    display_order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for items belonging to this category
CategorySchema.virtual("items", {
  ref: "MenuItem",
  localField: "id",
  foreignField: "category_id",
});

module.exports = mongoose.model("Category", CategorySchema);
