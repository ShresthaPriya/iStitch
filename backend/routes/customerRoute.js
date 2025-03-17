const express = require("express");
const router = express.Router();
const { getCustomer, addCustomer, updateCustomer, deleteCustomer, upload } = require("../controller/customer/customerDetails");

router.get('/', getCustomer);
// router.post('/', addCustomer);
router.post("/",upload.single('file'), addCustomer); // Upload route for adding recipes

router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;