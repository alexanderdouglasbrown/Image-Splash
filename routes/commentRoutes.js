const express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Splash = require("../models/splash.js"),
    Comment = require("../models/comment.js")

router.post("/new", middleware.checkLoggedIn, (req, res) => {
    if (req.body.comment == ""){
        req.flash("error", "Comments cannot be blank")
        return res.redirect("/splash/" + req.params.id)
    }
    const newComment = {
        text: req.body.comment,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }

    Comment.create(newComment, (err, comment) => {
        if (err) {
            req.flash("error", "Could not create comment")
            return res.redirect("/splash/" + req.params.id)
        } else {
            Splash.findById(req.params.id, (err, splash) => {
                if (err) {
                    req.flash("error", "Could not create comment")
                    return res.redirect("/splash/" + req.params.id)
                }
                splash.comments.push(comment)
                splash.save()
                res.redirect("/splash/" + req.params.id)
            })
        }
    })
})

router.get("/:comment_id/edit", middleware.checkLoggedIn, middleware.checkCommentOwner, (req, res) => {
    Comment.findById(req.params.comment_id, (err, cb) => {
        if (err){
            req.flash("error", "Could not edit comment")
            return res.redirect("/splash/" + req.params.id)
        }
        res.render("splash/comments/edit", {comment: cb, splash_id: req.params.id})
    })
})

router.put("/:comment_id", middleware.checkLoggedIn, middleware.checkCommentOwner, (req, res) => {
    const updateData = {
        text: req.body.text,
    }
    Comment.findByIdAndUpdate(req.params.comment_id, { $set: updateData }, (err) => {
        if (err) {
            console.log("Failed to update at id " + req.params.id)
        }
        res.redirect("/splash/" + req.params.id)
    })
})

router.delete("/:comment_id", middleware.checkLoggedIn, middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log("Failed to delete at id " + req.params.id)
        }
        res.redirect("/splash/" + req.params.id)
    })
})

module.exports = router