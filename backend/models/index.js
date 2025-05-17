const mongoose = require('mongoose');

// Import all schemas
const userSchema = require('./User').schema;
const itemSchema = require('./ItemSchema').schema;
const orderSchema = require('./Order').schema;
// ... other schemas

// Create models only if they don't exist
const models = {};

if (!mongoose.models.User) {
    models.User = mongoose.model('User', userSchema);
} else {
    models.User = mongoose.model('User');
}

if (!mongoose.models.Item) {
    models.Item = mongoose.model('Item', itemSchema);
} else {
    models.Item = mongoose.model('Item');
}

if (!mongoose.models.Order) {
    models.Order = mongoose.model('Order', orderSchema);
} else {
    models.Order = mongoose.model('Order');
}

// ... other models

module.exports = models;
