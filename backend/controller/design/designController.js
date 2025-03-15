const Design = require("../../models/DesignSchema");

exports.addDesign = async (req, res) => {
  try {
    const { name, subcategory } = req.body;
    const designPhotos = {
      fullSleeve: req.files.fullSleeve ? req.files.fullSleeve[0].path : null,
      halfSleeve: req.files.halfSleeve ? req.files.halfSleeve[0].path : null,
      sleeve: req.files.sleeve ? req.files.sleeve[0].path : null,
    };

    const newDesign = new Design({
      name,
      subcategory,
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
    const { name, subcategory } = req.body;
    const designPhotos = {
      fullSleeve: req.files.fullSleeve ? req.files.fullSleeve[0].path : null,
      halfSleeve: req.files.halfSleeve ? req.files.halfSleeve[0].path : null,
      sleeve: req.files.sleeve ? req.files.sleeve[0].path : null,
    };

    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    design.name = name || design.name;
    design.subcategory = subcategory || design.subcategory;
    design.designPhotos = { ...design.designPhotos, ...designPhotos };

    await design.save();
    res.status(200).json({ message: "Design updated successfully", design });
  } catch (error) {
    res.status(500).json({ message: "Failed to update design", error: error.message });
  }
};
