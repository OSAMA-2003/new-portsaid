const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["suggestion", "complaint"],
      default: "suggestion",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    is_read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
