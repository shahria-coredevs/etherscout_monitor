const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    txHash: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    tokenName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})



const Report = mongoose.model('Report', reportSchema)

module.exports = Report