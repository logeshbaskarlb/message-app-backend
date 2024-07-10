const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const { getReceiverSocketId, io } = require("../socket/socket.js");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
        participant: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participant: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.message.push(newMessage._id);
    }
    await conversation.save();
    await newMessage.save();

    // await Promise.all([conversation.save() , newMessage.save()])
    // Socket.io function

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        // io.to(<socket_id>).emit() used to send events to specific client
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendmessage controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatID } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
        participant: { $all: [senderId, userToChatID] },
    }).populate("message"); // not reference  but actual message

    if (!conversation) return res.status(200).json([]);

    const message = conversation.message;

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getMessage controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessages };
