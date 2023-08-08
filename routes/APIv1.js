const express = require('express')
const router = express.Router()
const schema = require("../schema/newsJSON")
const config = require("../JSON/user.json")
const { jwtPrivateKey } = require("../config.json")
const bscypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth");
const { admin, editor, viewer } = require("../middleware/roles");   

router.get('/', async (req, res, next) => {
    res.json({ API_v1: "Operationnal" })
})

router.post('/get-token', async (req, res) => {
    const users = [config]

    let user = users.find(u => u.email === req.body.email)
    console.log(user)
    if (!user) return console.log("Invalid email or password")

    console.log(req.body.password + '\n' + user.password)
    const valid = await users.find(u => u.password === req.body.password)
    if (!valid) return console.log("Invalid email or password")


    const token = jwt.sign({
        id: user._id,
        roles: user.roles,
    }, jwtPrivateKey, { expiresIn: "60m" })

    res.send({
        ok: true,
        token: token
    })
})

router.get('/news', async (req, res) => {
    try {
        const news = await schema.find()
        res.json(news)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/news/:id', getAllnews, (req, res) => {
    res.json(res.news)
})

router.post('/news', [auth, editor], async (req, res) => {
    const totalNews = await schema.collection.count()
    const schemas = new schema({
        newsName: req.body.name,
        newsDesc: req.body.description,
        newsID: totalNews + 1
    })
    try {
        const newNews = await schemas.save()
        res.status(201).json(newNews)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

async function getAllnews(req, res, next) {
    let news
    try {
        news = await schema.findOne({ newsID: req.params.id })
      if (news == null) {
        return res.status(404).json({ message: 'Cannot find news' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.news = news
    next()
}

module.exports = router