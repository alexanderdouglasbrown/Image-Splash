const express = require("express"),
    router = express.Router(),
    multer = require("multer"),
    middleware = require("../middleware"),
    fs = require("fs"),
    gm = require("gm").subClass({ imageMagick: true }),
    cloudinary = require("cloudinary"),
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
    const processedURI = "./uploads/proc_" + req.file.filename

    function processImage() {
        //Cloudinary wasn't handling auto-rotation properly
        //Also, hacky image error checking
        gm(uploadURI)
            .noProfile()
            .autoOrient()
            .write(processedURI, (err) => {
                if (!err) {
                    sendToCloudinary()
                } else {
                    console.log(err)
                    fs.unlink(uploadURI, (err) => { })
                    req.flash("error", "Could not create Splash (Processing)")
                    return res.redirect("/splash")
                }
            })
    }

    function sendToCloudinary() {
        cloudinary.v2.uploader.upload(processedURI, (err, image) => {
            fs.unlink(uploadURI, (err) => { })
            fs.unlink(processedURI, (err) => { })
            if (err) {
                req.flash("error", "Could not create Splash (Upload)")
                return res.redirect("/splash")
            } else {
                commitToDB(image.public_id, image.format)
            }
        })
    }

    function commitToDB(publicID, fileFormat) {
        const newSplash = {
            title: req.body.title,
            description: req.body.description,
            public_id: publicID,
            format: fileFormat,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        }

        Splash.create(newSplash, (err) => {
            if (err) {
                req.flash("error", "Could not create Splash (DB)")
            }
            res.redirect("/splash")
        })
    }

    processImage()
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