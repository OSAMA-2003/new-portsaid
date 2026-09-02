const express = require("express");
const router = express.Router();
const { seedDatabase, getDatabaseStats } = require("../controllers/seedController");

router.post("/", seedDatabase);
router.get("/stats", getDatabaseStats);

module.exports = router;
