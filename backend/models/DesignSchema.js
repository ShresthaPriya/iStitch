const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  designPhotos: {
    fullSleeve: {
      type: [String],
      required: false,
    },
    halfSleeve: {
      type: [String],
      required: false,
    },
    sleeve: {
      type: [String],
      required: false,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Design", DesignSchema);
