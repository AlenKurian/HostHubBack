const jwt = require('jsonwebtoken')

const adminMiddleware = (req, res, next) => {
    console.log("inside admin middleware");
    console.log(req.headers.authorization.slice(7));
    const token = req.headers.authorization.slice(7)
    try {
        const jwtVerification = jwt.verify(token, process.env.jwtKey)
        console.log(jwtVerification);
        req.payload = jwtVerification.userMail
        req.role = jwtVerification.role
        if (jwtVerification.role == "admin") {
            next()
        }
        else {
            res.status(403).json("Authorization failed!...Only for admin")
        }
    }
    catch (err) {
        res.status(402).json("Authorization failed!")
    }
}

module.exports = adminMiddleware
