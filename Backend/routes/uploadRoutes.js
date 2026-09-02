const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadImage, deleteImage } = require("../controllers/uploadController");

// POST /api/upload - Accepts either multipart file or base64
router.post("/", upload.single("image"), uploadImage);
router.delete("/", deleteImage);

module.exports = router;
