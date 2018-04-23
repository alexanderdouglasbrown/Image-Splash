const express = require("express"),
    router = express.Router(),
    multer = require("multer"),
    middleware = require("../middleware"),
    fs = require("fs"),
    gm = require("gm").subClass({ imageMagick: true }),
    Splash = require("../models/splash.js")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
})
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    //skip() and limit() to pull a specific range
    Splash.find().sort({ "date": -1 }).exec((err, cb) => {
        res.render("splash/index", { splashes: cb })
    })
})

router.post("/", upload.single("image"), (req, res) => {
    const uploadURI = "./uploads/" + req.file.filename
    const thumbURI = "./public/images/thumbs/thumb_" + req.file.filename
    const compressedURI = "./public/images/splashes/splash_" + req.file.filename

    //Using functions to hide callback hell
    function startTheChain() { //Make the thumbnail
        gm(uploadURI)
            .resize(350, 350)
            .noProfile()
            .autoOrient()
            .write(thumbURI, (err) => {
                if (!err) {
                    processImage()
                } else {
                    req.flash("error", "Could not create Splash")
                    deleteTheOriginal()
                    return res.redirect("/splash")
                }
            })
    }

    function processImage() {
        gm(uploadURI)
            .noProfile()
            .autoOrient()
            .write(compressedURI, (err) => {
                deleteTheOriginal() //Don't want it either way now

                if (!err) {
                    createSplash()
                } else {
                    req.flash("error", "Could not create Splash")
                    return res.redirect("/splash")
                }
            })
    }

    function deleteTheOriginal(){
        fs.unlink(uploadURI, (err)=>{})
    }

    function createSplash() { //Add to DB and redirect
        const newSplash = {
            title: req.body.title,
            description: req.body.description,
            filename: req.file.filename,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        }

        Splash.create(newSplash, (err) => {
            if (err) {
                console.log("An error occured trying to create new Splash")
            }
            res.redirect("/splash")
        })
    }

    startTheChain()
})

router.get("/new", middleware.checkLoggedIn, (req, res) => {
    res.render("splash/new")
})

router.get("/:id", (req, res) => {
    Splash.findById(req.params.id, (err, cb) => {
        if (err || !cb) {
            req.flash("error", "Splash not found")
            return res.redirect("/splash")
        }
        res.render("splash/show", { splash: cb })
    })
})

router.get("/:id/edit", middleware.checkLoggedIn, middleware.checkSplashOwner, (req, res) => {
    Splash.findById(req.params.id, (err, cb) => {
        if (err) {
            console.log("Failed to find Splash for editing at id " + req.params.id)
        }
        res.render("splash/edit", { splash: cb })
    })
})

router.put("/:id", middleware.checkLoggedIn, middleware.checkSplashOwner, (req, res) => {
    const updateData = {
        title: req.body.title,
        description: req.body.description
    }
    Splash.findByIdAndUpdate(req.params.id, { $set: updateData }, (err) => {
        if (err) {
            console.log("Failed to update at id " + req.params.id)
        }
        res.redirect("/splash/" + req.params.id)
    })
})

router.delete("/:id", middleware.checkLoggedIn, middleware.checkSplashOwner, (req, res) => {
    Splash.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log("Failed to delete at id " + req.params.id)
        }
        res.redirect("/splash")
    })
})

module.exports = router