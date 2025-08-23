const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true,
        default: 0,   // optional: sets default value
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    }
})

const counter = mongoose.model('counter', counterSchema);
module.exports = counter;