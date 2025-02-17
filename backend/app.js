const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const customerRoute = require("./routes/customerRoute");
const orderRoute = require("./routes/orderRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/customer", customerRoute);
app.use("/order", orderRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
