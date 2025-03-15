const express = require("express");
const router = express.Router();
const designController = require("../controller/design/designController");
const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/designs"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  { name: 'fullSleeve', maxCount: 1 },
  { name: 'halfSleeve', maxCount: 1 },
  { name: 'sleeve', maxCount: 1 },
]);

// Route to add a new design
router.post("/", uploadFields, designController.addDesign);

// Route to update an existing design
router.put("/:id", uploadFields, designController.updateDesign);

module.exports = router;
