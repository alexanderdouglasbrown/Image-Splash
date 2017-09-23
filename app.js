const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose")

mongoose.connect(process.env.DB_URL)

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))

const routes = require("./routes/routes.js"),
    splashRoutes = require("./routes/splashRoutes.js")

app.use("/", routes)
app.use("/splash", splashRoutes)

app.listen(process.env.PORT, (error) => {
    console.log(`Listening on port ${process.env.PORT}`)
})