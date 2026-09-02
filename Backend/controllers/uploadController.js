const cloudinary = require("../config/cloudinary");
const streamifier = require("stream");

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
exports.uploadImage = async (req, res) => {
  try {
    const folder = req.body.folder || "new-portsaid";

    // 1. Check if file is uploaded as FormData (req.file)
    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload stream error:", error);
            return res.status(500).json({ success: false, message: error.message });
          }

          return res.status(200).json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        }
      );

      const bufferStream = new streamifier.PassThrough();
      bufferStream.end(req.file.buffer);
      bufferStream.pipe(uploadStream);
      return;
    }

    // 2. Check if image is sent as base64 string or external URL in JSON body
    if (req.body.image) {
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: folder,
        resource_type: "image",
      });

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      });
    }

    return res.status(400).json({
      success: false,
      message: "No image file or base64 data provided",
    });
  } catch (error) {
    console.error("Cloudinary upload controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload
exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: "public_id is required" });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
