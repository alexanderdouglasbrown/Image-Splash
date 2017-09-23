const mongoose = require("mongoose")

const splashSchema = new mongoose.Schema({
    title: String,
    url: String
})

module.exports = mongoose.model("Splash", splashSchema)