const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    passportLocal = require("passport-local"),
    mongoose = require("mongoose"),
    flash = require("connect-flash")

const userModel = require("./models/user")

mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL, { useMongoClient: true })

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))

app.use(require("express-session")({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportLocal(userModel.authenticate()))
passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())

app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.info = req.flash("info")
    res.locals.error = req.flash("error")
    next()
})

const routes = require("./routes/routes.js"),
    splashRoutes = require("./routes/splashRoutes.js"),
    commentRoutes = require("./routes/commentRoutes.js")

app.use("/", routes)
app.use("/splash", splashRoutes)
app.use("/splash/:id/comment", commentRoutes)
app.use((req, res) => {
    res.type("text/plain")
    res.status(404)
    res.send("404 - Not Found")
})

app.listen(process.env.PORT || 3000, (error) => {
    console.log(`Listening on port ${process.env.PORT || 3000}`)
})