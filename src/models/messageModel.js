const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    file: {
      type: Object,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model("Message", MessageSchema);
