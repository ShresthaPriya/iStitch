const Design = require("../../models/DesignSchema");

exports.addDesign = async (req, res) => {
  try {
    const { name, subcategory } = req.body;
    const designPhotos = req.files.map(file => file.path);

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
    const designPhotos = req.files.map(file => file.path);

    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    design.name = name || design.name;
    design.subcategory = subcategory || design.subcategory;
    design.designPhotos = designPhotos.length > 0 ? designPhotos : design.designPhotos;

    await design.save();
    res.status(200).json({ message: "Design updated successfully", design });
  } catch (error) {
    res.status(500).json({ message: "Failed to update design", error: error.message });
  }
};
