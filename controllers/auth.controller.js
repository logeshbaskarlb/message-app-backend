const User = require("../models/user.model.js")
const bcrypt = require('bcryptjs');
const generateTokenCookie = require("../utils/generateToken.js");
const signup = async (req,res) =>{
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
        return res.status (400).json({ error: "Passwords don't match" });
        }
        const user = await User.findOne({ username });
        if (user) {
        return res.status(400).json({ error: "Username already exists" });
        }
        // HASH PASSWORD HERE
        const salt = await bcrypt.genSalt (10);
        const hashedPassword = await bcrypt.hash (password, salt);

        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
        const newUser = new User({
        fullname,
        username,
        password: hashedPassword,
        gender,
        profilePicture  : gender === "male" ? boyProfilePic : girlProfilePic
    })

   if(newUser){
    generateTokenCookie(newUser._id, res)
    await newUser.save()
    res.status(201).json({
        _id : newUser._id,
        username :newUser.username,
        fullname :newUser.fullname,
        profilePicture :newUser.profilePicture,
    })
   }else{
    res.status(400).json({error : "Invalid user data"})
   }
 } catch (error) {
     console.log(error);    
    res.status(500).json({
        error : "Internal error"
    })
}
};

const login = async (req,res) =>{
try {
    const { username , password } = req.body;
     const user = await User.findOne({username})
     const isPasswordCorrect = await bcrypt.compare(password, user?.password || "" )
     if( !user || !isPasswordCorrect){
        return res.status(400).json({error : "Invalid credentials"})
        }
    
        generateTokenCookie(user._id, res)
        res.status(201).json({
            _id : user._id,
            fullname :user.fullname,
            username :user.username,
            profilePicture :user.profilePicture,
        })

} catch (error) {
    console.log(error);    
    res.status(500).json({
        error : "Internal error"
    })
}
}
const logout = (req, res) =>{
try {
    res.cookie("jwt", "", {maxAge:0})
    res.status(200).json({message : "Logged out successfully"})
} catch (error) {
    console.log(error);    
    res.status(500).json({
        error : "Internal error"
    })
}
}

module.exports = {login, logout, signup}