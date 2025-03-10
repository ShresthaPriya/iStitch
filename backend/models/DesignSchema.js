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
  designPhotos: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Design", DesignSchema);
