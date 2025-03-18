const Design = require("../../models/DesignSchema");

exports.addDesign = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    const designPhotos = {
      fullSleeve: req.files.fullSleeve ? req.files.fullSleeve.map(file => file.filename) : [],
      halfSleeve: req.files.halfSleeve ? req.files.halfSleeve.map(file => file.filename) : [],
      sleeve: req.files.sleeve ? req.files.sleeve.map(file => file.filename) : [],
    };

    const newDesign = new Design({
      name,
      category,
      price,
      description,
      designPhotos,
    });

    await newDesign.save();
    res.status(201).json({ message: "Design added successfully", design: newDesign });
  } catch (error) {
    res.status(500).json({ message: "Failed to add design", error: error.message });
  }
};

exports.updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description } = req.body;
    const designPhotos = {
      fullSleeve: req.files.fullSleeve ? req.files.fullSleeve.map(file => file.filename) : [],
      halfSleeve: req.files.halfSleeve ? req.files.halfSleeve.map(file => file.filename) : [],
      sleeve: req.files.sleeve ? req.files.sleeve.map(file => file.filename) : [],
    };

    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    design.name = name || design.name;
    design.category = category || design.category;
    design.price = price || design.price;
    design.description = description || design.description;
    design.designPhotos = designPhotos;

    await design.save();
    res.status(200).json({ message: "Design updated successfully", design });
  } catch (error) {
    res.status(500).json({ message: "Failed to update design", error: error.message });
  }
};

exports.getAllDesigns = async (req, res) => {
  try {
    const designs = await Design.find();
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch designs", error: error.message });
  }
};

exports.deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const design = await Design.findByIdAndDelete(id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.status(200).json({ message: "Design deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete design", error: error.message });
  }
};
