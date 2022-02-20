const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const validator = require("validator")
const { USER_SOURCE } = require("../../util/constants")
const schema = new Schema({
    source: {
        type: String,
        required: true,
        trim: true,
        enum: USER_SOURCE
    },
    metrics: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    session_id: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email : {
        type: String,
        required: true,
        validate: validator.isEmail,
        trim: true,
    },
    hashedOTP : {
        type: String,
        required: false,
        trim: true
    }
})
module.exports = schema