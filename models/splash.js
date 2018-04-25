const mongoose = require("mongoose")

const splashSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    public_id: String,
    format: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})

module.exports = mongoose.model("Splash", splashSchema)