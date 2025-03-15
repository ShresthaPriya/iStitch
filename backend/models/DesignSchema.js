const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  designPhotos: {
    fullSleeve: {
      type: String,
      required: false,
    },
    halfSleeve: {
      type: String,
      required: false,
    },
    sleeve: {
      type: String,
      required: false,
    },
  },
});

module.exports = mongoose.model("Design", DesignSchema);
