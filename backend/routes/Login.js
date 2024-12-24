const express = require("express");
const router = express.Router();
const { Login} = require("../controller/user/Login");


router.post("/", Login);


module.exports = router;
