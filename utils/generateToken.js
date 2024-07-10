const jwt = require("jsonwebtoken")

const generateTokenCookie = (userId, res) =>{

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "15d"
    })

    res.cookie("jwt", token, {
        maxAge : 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent xss attacks cross site scriptiong attacks
        sameSite: "strict", // prevent csrf attacks
        secure : process.env.NODE_ENV !== "development"
    })

}

module.exports = generateTokenCookie