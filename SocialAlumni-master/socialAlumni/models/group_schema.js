const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    members: {type: [], required : true}
});

const group_schema = mongoose.model('group', groupSchema);

module.exports = group_schema;