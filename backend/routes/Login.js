const express = require("express");
const router = express.Router();
const { Login} = require("../controller/user/Login");


router.post("/", Login);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));



module.exports = router;
