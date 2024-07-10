const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participant : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
    ],
    message : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Message",
            default : []
        }
    ]
}, { timestamps :true })

const Conversation = mongoose.model("Conversation",conversationSchema)
module.exports =  Conversation 