const express = require("express");
const router = express.Router();
const {
  getCategories,
  upsertCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.route("/").get(getCategories).post(upsertCategory);
router.route("/:id").delete(deleteCategory);

module.exports = router;
