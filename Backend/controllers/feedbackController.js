const Feedback = require("../models/Feedback");

// @desc    Submit customer feedback/complaint (Public)
// @route   POST /api/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, phone, type, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, and message are required",
      });
    }

    const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const feedback = await Feedback.create({
      id: feedbackId,
      name: name.trim(),
      phone: phone.trim(),
      type: type === "complaint" ? "complaint" : "suggestion",
      message: message.trim(),
      is_read: false,
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all feedback (Admin)
// @route   GET /api/feedback/all
exports.getAllFeedbackAdmin = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, count: feedbackList.length, data: feedbackList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark feedback as read/unread (Admin)
// @route   PATCH /api/feedback/:id/read
exports.markFeedbackRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    const feedback = await Feedback.findOneAndUpdate(
      { id },
      { is_read: is_read !== undefined ? Boolean(is_read) : true },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete feedback (Admin)
// @route   DELETE /api/feedback/:id
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findOneAndDelete({ id });

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
