const express = require("express");
const router = express.Router();

const categoryRoutes = require("./categoryRoutes");
const menuItemRoutes = require("./menuItemRoutes");
const settingsRoutes = require("./settingsRoutes");
const reviewRoutes = require("./reviewRoutes");
const feedbackRoutes = require("./feedbackRoutes");
const uploadRoutes = require("./uploadRoutes");
const seedRoutes = require("./seedRoutes");

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "New Port Said API",
  });
});

router.use("/categories", categoryRoutes);
router.use("/menu", menuItemRoutes);
router.use("/settings", settingsRoutes);
router.use("/reviews", reviewRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/upload", uploadRoutes);
router.use("/seed", seedRoutes);

module.exports = router;
