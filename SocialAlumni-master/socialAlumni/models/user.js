const mongoose = require("mongoose");
var passportLocal = require('passport-local-mongoose');
const { options } = require("../routes");

const users = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    phone_number: {type: Number, required: true},
    profile_photo: {type: String, required: false},
    points: {type: Number, required: false, default: 0},
    level: {type: String, required: false, default: "New"},
    alumni: {type: Boolean, required: false},
    student: {type: Boolean, required: false},
    major: {type: String, required: false},
    interests: {type: String, required: false},
    degree: {type: String, required: false},
    job: {type: String, required: false}
});

users.plugin(passportLocal, { usernameField: 'email' });

const user_schema = mongoose.model('User', users);

module.exports = user_schema;