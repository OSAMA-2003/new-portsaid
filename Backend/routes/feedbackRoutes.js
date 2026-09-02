const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getAllFeedbackAdmin,
  markFeedbackRead,
  deleteFeedback,
} = require("../controllers/feedbackController");

router.post("/", submitFeedback);
router.get("/all", getAllFeedbackAdmin);
router.patch("/:id/read", markFeedbackRead);
router.delete("/:id", deleteFeedback);

module.exports = router;
