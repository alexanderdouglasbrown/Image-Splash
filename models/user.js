const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isMod: {
        type: Boolean,
        default: false
    }
}, {
        usePushEach: true
    })

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)