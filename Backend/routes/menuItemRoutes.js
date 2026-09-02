const express = require("express");
const router = express.Router();
const {
  getMenuWithCategories,
  getMenuItems,
  upsertMenuItem,
  deleteMenuItem,
} = require("../controllers/menuItemController");

router.get("/full", getMenuWithCategories);
router.route("/items").get(getMenuItems).post(upsertMenuItem);
router.route("/items/:id").delete(deleteMenuItem);

module.exports = router;
