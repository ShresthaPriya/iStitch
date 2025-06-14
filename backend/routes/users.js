const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure the path is correct
const bcrypt = require("bcryptjs");
const verifyToken = require("../middleware/Middleware"); // Import token verification middleware

// Fetch all users
router.get('/', async (req, res) => {
    try {
        console.log("Fetching all users...");
        const users = await User.find().select("-password"); // Remove password from results
        console.log(`Found ${users.length} users`);
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: err.message });
    }
});

// Fetch user by email
router.get('/email/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select("-password");
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
        const user = await User.findById(req.params.id).select("-password");
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
        const { fullname, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }

        const newUser = new User({
            fullname,
            email,
            password, // In a real app, hash this password before saving
            role: role || 'user'
        });

        await newUser.save();

        const userResponse = { ...newUser.toObject() };
        delete userResponse.password; // Don't return the password

        res.status(201).json({ success: true, user: userResponse });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        const { fullname, email, role } = req.body;
        const updatedFields = {};

        if (fullname) updatedFields.fullname = fullname;
        if (email) updatedFields.email = email;
        if (role) updatedFields.role = role;

        // Only update password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Change user password
router.put('/:id/password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.params.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password
        user.password = hashedPassword;
        await user.save();

        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;