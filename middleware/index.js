const Splash = require("../models/splash"),
    Comment = require("../models/comment")

module.exports = {
    checkLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        } else {
            req.flash("info", "Please log in to continue")
            res.redirect("/login")
        }
    },
    checkSplashOwner: (req, res, next) => {
        Splash.findById(req.params.id, (err, cb) => {
            if (cb.author.id.equals(req.user._id))
                return next()
            else {
                req.flash("error", "You do not have permission to perform that action")
                res.redirect("/splash/" + req.params.id)
            }
        })
    },
    checkCommentOwner: (req, res, next) => {
        Comment.findById(req.params.comment_id, (err, cb) => {
            if (cb.author.id.equals(req.user._id))
                return next()
            else {
                req.flash("error", "You do not have permission to perform that action")
                res.redirect("/splash/" + req.params.id)
            }
        })
    }
}