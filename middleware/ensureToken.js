const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../config.json")

module.exports = (req, res, next) => {
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