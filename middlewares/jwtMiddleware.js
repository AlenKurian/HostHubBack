const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next) => {
    console.log("inside Jwt middleware");
    console.log(req.headers.authorization.slice(7));
    const token = req.headers.authorization.slice(7)
    try {
        const jwtVerification = jwt.verify(token, process.env.jwtKey)
        req.payload = jwtVerification;
        console.log(jwtVerification);
        req.user = {
            userId: jwtVerification.userId,
            userMail: jwtVerification.userMail,
            role: jwtVerification.role,
        }
    }
    catch (err) {
        res.status(401).json("Authorization failed")
    }
    
    next();
}
module.exports = jwtMiddleware
