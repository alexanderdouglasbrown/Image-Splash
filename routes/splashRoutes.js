const express = require("express"),
    router = express.Router(),
    Splash = require("../models/splash.js")

router.get("/", (req, res) => {
    Splash.find({}, (err, dbCall) => {
        if (err) {
            console.log("Failed to retrieve Splashes")
        }
        res.render("splash/index", { splashes: dbCall })
    })
})

router.post("/", (req, res) => {
    const newSplash = {
        title: req.body.title,
        url: req.body.url
    }
    Splash.create(newSplash, (err) => {
        if (err) {
            console.log("An error occured trying to create new Splash")
        }
        res.redirect("/splash")
    })
})

router.get("/new", (req, res) => {
    res.render("splash/new")
})

router.get("/:id", (req, res) => {
    Splash.findById(req.params.id, (err, dbCall) => {
        if (err) {
            console.log("Failed to find Splash by id " + req.params.id)
        }
        res.render("splash/show", { splash: dbCall })
    })
})

router.get("/:id/edit", (req, res) => {
    Splash.findById(req.params.id, (err, dbCall) => {
        if (err) {
            console.log("Failed to find Splash for editing at id " + req.params.id)
        }
        res.render("splash/edit", { splash: dbCall })
    })
})

router.put("/:id", (req, res) => {
    const updateData = {
        title: req.body.title,
        url: req.body.url
    }
    Splash.findByIdAndUpdate(req.params.id, { $set: updateData }, (err) => {
        if (err){
            console.log("Failed to update at id " + req.params.id)
        }
        res.redirect("/splash/" + req.params.id)
    })
})

router.delete("/:id", (req, res) => {
    Splash.findByIdAndRemove(req.params.id, (err) =>{
        if (err) {
            console.log ("Failed to delete at id " + req.params.id)
        }
        res.redirect("/splash")
    })
})

module.exports = router;