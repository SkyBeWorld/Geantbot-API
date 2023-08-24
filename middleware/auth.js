const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../config.json")

module.exports = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send({
        ok: false,
        error: "Access denied. The token need admins perms"
    });

    try {
        const decoded = jwt.verify(token, jwtPrivateKey);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send({
            ok: false,
            error: "Token expired"
        });
    }

    next();
}