const express = require("express");
const router = express.Router();
const {
  submitReview,
  getApprovedReviews,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/", submitReview);
router.get("/approved", getApprovedReviews);
router.get("/all", getAllReviewsAdmin);
router.patch("/:id/status", updateReviewStatus);
router.delete("/:id", deleteReview);

module.exports = router;
