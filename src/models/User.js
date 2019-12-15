const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    // TODO: Add User Schema
});

const User = new mongoose.model('User', schema);
module.exports = User;
