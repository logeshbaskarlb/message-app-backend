const { Server } = require("socket.io")
const http = require("http")
const express = require("express");

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors : { 
        origin : ["https://chatting-app-one-to-one.netlify.app"],
        methods : ["GET", "POST"],
    }
})

const getReceiverSocketId = (receiverId) => {
   return userScoketMap[receiverId]
}

const userScoketMap = {}  // {userId : socketId}

io.on('connection', (socket)=> {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId !== "undefined") userScoketMap[userId] = socket.id

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userScoketMap))

    // socket.io used to listen to the events. can be used both on client and server side
    socket.on('disconnect', ()=> {
        console.log("user disconnected", socket.id);
        delete userScoketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userScoketMap))

    })
})

module.exports =  {app, io, server , getReceiverSocketId}