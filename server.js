const express = require("express");
const fileUpload = require("express-fileupload");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRouter = require("./src/routers/authRouter")
const userRouter = require("./src/routers/userRouter")
const chatRouter = require("./src/routers/chatRouter")
const messageRouter = require("./src/routers/messageRouter")

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    // origin: "*",
    origin: "https://main--stalwart-elf-acf24c.netlify.app",
    // methods: ["GET", "POST"],
  }
});

// to save files for public
app.use(express.static('src/public'))

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Chat App")
})

// Websocket functions
let activeUsers = []

io.on("connection", (socket)=> {
  // console.log("Client dasturga kirdi");
  socket.on("new-user-add", (newUserId)=>{
    if(!activeUsers.some(user=> user.userId === newUserId)){
      activeUsers.push({userId: newUserId, socketId: socket.id})
    }
    // console.log(activeUsers);
    // send all active users to new user
    io.emit("get-users", activeUsers)
  })

  socket.on("disconnect", ()=>{
    // remove user from active users
    activeUsers = activeUsers.filter(user => user.socketId !== socket.id)

    // console.log(activeUsers);
    // send all active users to new user
    io.emit("get-users", activeUsers)
  })


  // send message to a specific user
  socket.on("send-message", (data) => {
    const {receivedId} = data
    const user = activeUsers.find(user => user.userId === receivedId);
    if(user) {
      io.to(user.socketId).emit("recieve-message", data)
    }
  })
})

const PORT = process.env.PORT || 4001;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
  UseNewUrlParser: true,
  UseUnifiedTopology: true,
  family: 4
}).then(()=> {
  server.listen(PORT, ()=> console.log(`Server started on port: ${PORT}`))
}).catch(error => console.log(error))
