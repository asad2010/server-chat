const Message = require("../models/messageModel");
const { removeTemp, uploadedFile, deleteFile } = require("../services/cloudinary");

const messageCtrl = {
  // create new message
  addMessage: async (req, res) => {
    const {chatId, senderId } = req.body;
    try {
      if(!chatId || !senderId) {
        return res.status(403).json("Invalid credentials!")
      }
      if(req.files) {
        const image = req.files.image;
        if(image.mimetype !== "image/jpeg" && image.mimetype !== "image/png") {
          removeTemp(image.tempFilePath);
          return res.status(400).json({message: "File format is should png or jpeg!"})
        }

        const img = await uploadedFile(image);
        req.body.file = img;
        
      }
      const message = new Message(req.body);
      await message.save();

      res.status(201).json(message)
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },

  // get messages
  getMessages: async (req, res) => {
    try {
      const {chatId} = req.params;
      const messages = await Message.find({chatId});
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },

  // delete a message
  deleteMessage: async (req, res) => {
    try {
      const {messageId} = req.params;
      const message = await Message.findByIdAndDelete(messageId);
      if(message) {
        if(message.file.public_id) {
          await deleteFile(message.file.public_id);
        }
        return res.status(200).json("Message deleted successfully!");
      }
      res.status(404).json({message: "Message not found!"})
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }
}

module.exports = messageCtrl;