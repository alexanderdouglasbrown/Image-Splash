const express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Splash = require("../models/splash.js"),
    Comment = require("../models/comment.js")

router.post("/new", middleware.checkLoggedIn, (req, res) => {
    if (req.body.comment == "") {
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

    Comment.create(newComment)
        .then(comment => {
            Splash.findById(req.params.id)
                .then(splash => {
                    splash.comments.push(comment)
                    splash.save()
                    res.redirect("/splash/" + req.params.id)
                })
                .catch(err => {
                    req.flash("error", "Could not create comment")
                    return res.redirect("/splash/" + req.params.id)
                })
        })
        .catch(err => {
            req.flash("error", "Could not create comment")
            return res.redirect("/splash/" + req.params.id)
        })
})

router.get("/:comment_id/edit", middleware.checkLoggedIn, middleware.checkCommentOwner, (req, res) => {
    Comment.findById(req.params.comment_id)
        .then(cb => {
            res.render("splash/comments/edit", { comment: cb, splash_id: req.params.id })
        })
        .catch(err => {
            req.flash("error", "Could not edit comment")
            return res.redirect("/splash/" + req.params.id)
        })
})

router.put("/:comment_id", middleware.checkLoggedIn, middleware.checkCommentOwner, (req, res) => {
    const updateData = {
        text: req.body.text,
    }
    
    if (updateData.text == "") {
        req.flash("error", "Comments cannot be blank")
        return res.redirect("/splash/" + req.params.id)
    }
    Comment.findByIdAndUpdate(req.params.comment_id, { $set: updateData })
        .then(cb => {
            res.redirect("/splash/" + req.params.id)
        })
        .catch(err => {
            console.log("Failed to update at id " + req.params.id)
        })
})

router.delete("/:comment_id", middleware.checkLoggedIn, middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id)
        .then(cb => {
            res.redirect("/splash/" + req.params.id)
        })
        .catch(err => {
            console.log("Failed to delete at id " + req.params.id)
        })
})

module.exports = router