const { Schema, Types, model } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    pwd: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    workingActivity: [{
       type: Types.ObjectId,
       ref: 'Day'
    }],
    status: {
        type: String,
    },
}, { timestamps: true })

module.exports = model('User', userSchema);