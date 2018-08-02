const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 32,
        required: true,
    },
    password: String,
    isMod: {
        type: Boolean,
        default: false
    }
}, {
        usePushEach: true,
        collation: {
            locale: 'en',
            strength: 2
        }
    })

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)