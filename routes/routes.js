const express = require("express"),
    passport = require("passport"),
    middleware = require("../middleware")
router = express.Router(),
    User = require("../models/user")

router.get("/", (req, res) => {
    res.redirect("/splash")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", (req, res) => {
    // // The site is now read-only
    // req.flash("error", "This site is in read-only mode")
    // return res.redirect("/splash")

    // // This is what would run if the site wasn't read-only
    if (req.body.username.length < 3) {
        req.flash("error", "Username must be at least 3 characters long")
        return res.redirect("/register")
    }
    if (req.body.password.length < 8) {
        req.flash("error", "Password must be at least 8 characters long")
        return res.redirect("/register")
    }
    User.register(new User({ username: req.body.username }), req.body.password)
        .then(user => {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/splash")
            })
        })
        .catch(err => {
            req.flash("error", err.message)
            return res.redirect("/register")
        })
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login", (req, res, next) => {
    // // The site is now read-only
    // req.flash("error", "This site is in read-only mode")
    // return res.redirect("/splash")

    // // This is what would run if the site wasn't read-only
    return next()
}, passport.authenticate("local", {
    successRedirect: "/splash",
    failureRedirect: "/login",
    failureFlash: true
}))

router.get("/settings", middleware.checkLoggedIn, (req, res) => {
    res.render("settings")
})

router.post("/settings", (req, res) => {
    User.findOne({ username: req.user.username })
        .then(user => {
            user.setPassword(req.body.password)
                .then(cb => {
                    req.flash("info", "Password changed")
                    user.save()

                    return res.redirect("/splash")
                })
                .catch(err => {
                    req.flash("error", "An error occured while trying to update password")
                    console.log(err.message)
                })
        })
        .catch(err => {
            req.flash("error", "An error occured while locating user")
            console.log(err.message)
            return res.redirect("/splash")
        })
})

router.get("/logout", (req, res) => {
    req.logout(() => {
        req.flash("info", "You have been logged out")
        res.redirect("/splash")
    })
})

module.exports = router