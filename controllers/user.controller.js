const User = require("../models/user.model");

const getUsersForSidebar = async (req, res) =>{
    try {

        const loggedInUserId = req.user._id;

        // it is used for chating with other if we remove the inner {_id :{$ne :}} we can message ourself
        const filteredUsers = await User.find({_id :{$ne : loggedInUserId}})
        .select(
            "-password"
        )
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUserForSidebar",error.message);
        res.status(500).json({ error : "Internal server error"})
    }
}

module.exports = getUsersForSidebar