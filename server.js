require('dotenv').config()
const config = require("./JSON/user.json")
const { jwtPrivateKey } = require("./config.json")
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth");

const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')

mongoose.connect(process.env.database, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


app.enable("trust proxy")
app.use(express.urlencoded({ extended: false }))
app.set("etag", false)
app.use(express.static(__dirname + "/website"))
app.set("views", __dirname)
app.set("view engine", "ejs")
app.use(express.json())

// API v1

const apiv1 = require("./routes/APIv1")
app.use("/v1", apiv1)

app.get('/', async(req, res) => {
    const args = {
        ok: false,
        error: false,
        token: null,
    }

    res.json({ "status": "ok" })
})

app.listen(8080, () => console.log('Server Started'))