require('dotenv').config()
const config = require("./JSON/user.json")
const { jwtPrivateKey } = require("./config.json")
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth");
const userSchema = require("./schema/APIKey")

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

// Generate API Key

app.post("/get-key", async(req, res) => {
    const data = await userSchema.findOne({ username: req.body.username }).catch(err => {  })
    if (!data) {
        try {
            const id = await userSchema.collection.count()
            const token = await jwt.sign({ id: id + 1, username: req.body.username}, jwtPrivateKey)
            userSchema.create({
                username: req.body.username,
                UserID: id + 1,
                APIKey: token
            })
    
            res.json({
                token: token
            })
        } catch (error) {
            console.log(error)
            res.sendStatus(405)
        }
    } else if (data){
        res.json({ username: data.username, token: data.APIKey })
    } else {
        res.statusCode(405)
    }
})

function ensureToken(req, res, next) {
    const header = req.headers["authorization"]
    if (typeof header !== "undefined") {
        const bearer = header.split(" ")
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}

app.listen(3019, () => console.log('Server Started'))