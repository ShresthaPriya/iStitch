const express = require("express");
const router = express.Router();
const { addCredentials} = require("../controller/user/RegistrationController");

// Define the routes
// router.get("/", getCredentials);
router.post("/", addCredentials);
// router.get("/:id", getUser)

module.exports = router;
