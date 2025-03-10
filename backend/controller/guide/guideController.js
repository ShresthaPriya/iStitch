const Guide = require("../../models/GuideSchema");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'video', maxCount: 1 },
    { name: 'guideFile', maxCount: 1 }
]);

// Get all guides
const getGuides = async (req, res) => {
    try {
        const guides = await Guide.find();
        res.status(200).json({ success: true, guides });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Add a new guide
const addGuide = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error uploading files:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, error: "Title is required" });
        }

        const video = req.files.video ? req.files.video[0].path : null;
        const guideFile = req.files.guideFile ? req.files.guideFile[0].path : null;

        try {
            const newGuide = new Guide({ title, video, guideFile, description });
            await newGuide.save();
            res.status(201).json({ success: true, guide: newGuide });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
};

// Update a guide
const updateGuide = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error uploading files:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        const { id } = req.params;
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, error: "Title is required" });
        }

        const video = req.files.video ? req.files.video[0].path : null;
        const guideFile = req.files.guideFile ? req.files.guideFile[0].path : null;

        try {
            const updatedGuide = await Guide.findByIdAndUpdate(id, { title, video, guideFile, description }, { new: true });
            res.status(200).json({ success: true, guide: updatedGuide });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
};

// Delete a guide
const deleteGuide = async (req, res) => {
    const { id } = req.params;
    try {
        await Guide.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Guide deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getGuides, addGuide, updateGuide, deleteGuide };