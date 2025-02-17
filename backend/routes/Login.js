const express = require("express");
const router = express.Router();
const { Login} = require("../controller/user/Login");


router.post("/", Login);
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// Fetch customer details
router.get('/customers', async (req, res) => {
    try {
        const customers = await User.find({ User: false });
        res.status(200).json({ success: true, customers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
