const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model

// Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select("-password -confirmPassword");
        console.log("Fetched users:", users);
        res.json(users); // Send an array directly
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: err.message });
    }
});

// Fetch user by email
router.get('/email/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select("-password -confirmPassword");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching user by email:", err);
        res.status(500).json({ message: err.message });
    }
});

// Fetch user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password -confirmPassword");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        res.status(500).json({ message: err.message });
    }
});

// Add a new user
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ success: true, user: newUser });
    } catch (err) {
        console.error("Error adding user:", err);
        res.json({ success: false, message: err.message });
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error("Error updating user:", err);
        res.json({ success: false, message: err.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.json({ success: false, message: err.message });
    }
});

module.exports = router;
