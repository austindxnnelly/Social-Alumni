const mongoose = require("mongoose");
const UserS = require('../models/user');


const messageSchema = new mongoose.Schema({
    first_name_sent: {type: String, required: false},
    last_name_sent: {type: String, required: false},
    username_sent: {type: String, required: true},
    username_recieved: {type: String, required: true},
    first_name_recieved: {type: String, required: false},
    last_name_recieved: {type: String, required: false},
    date: {type: Date, required: true},
    message_content: {type: String, required: true},
    owner: {type: Boolean}

})

const message_schema = mongoose.model('message', messageSchema);

module.exports = message_schema;