const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protectRoute = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"You are not authorized to access this route"
                })
            }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"Unauthorized - Invalid token"
            })
        }

        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(401).json({error:"User not found"
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "Internal error"})

    }
}

module.exports = protectRoute