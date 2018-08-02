const express = require("express"),
    passport = require("passport"),
    router = express.Router(),
    User = require("../models/user")

router.get("/", (req, res) => {
    res.redirect("/splash")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", (req, res) => {
    if (req.body.username.length < 3){
        req.flash("error", "Username must be at least 3 characters long")
        return res.redirect("/register")
    }
    if (req.body.password.length < 8){
        req.flash("error", "Password must be at least 8 characters long")
        return res.redirect("/register")
    }
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message)
            return res.redirect("/register")
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/splash")
        })
    })
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/splash",
    failureRedirect: "/login",
    failureFlash: true
}))

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("info", "You have been logged out")
    res.redirect("/splash")
})

module.exports = router