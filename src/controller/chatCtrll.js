const Chat = require("../models/chatModel");

const chatCtrl = {
  // Chat List
  userChats: async (req, res) => {
    try {
      const {id} = req.user;

      const chats = await Chat.find({members: {$in: [id]}});
      res.status(200).json(chats)

    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },

  // find chat or created chat
  findChat: async (req, res) => {
    try {
      const {firstId, secondId} = req.params;
      const chat = await Chat.findOne({members: {$all: [firstId, secondId]}})
      if(chat) {
        return res.status(200).json(chat);
      }
      const newChat = new Chat({members: [firstId, secondId]});
      newChat.save();
      res.status(201).json(newChat);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },

  // delete chat
  deleteChat: async (req, res) => {
    const {chatId} = req.params;
    try {
      const chat = await Chat.findByIdAndDelete(chatId);
      if(chat) {
        return res.status(200).json("Chat deleted Successfully!")
      }
      res.status(404).json({message: "Chat not found!"})
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }
}

module.exports = chatCtrl;