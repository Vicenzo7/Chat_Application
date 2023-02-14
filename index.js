const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const connect = require("./config/database-config");
const Chat = require("./models/chat");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    console.log("joining a room ", data.roomId);
    socket.join(data.roomId);
  });

  socket.on("msg_send", async (data) => {
    const chat = await Chat.create({
      roomId: data.roomId,
      user: data.username,
      content: data.msg,
    });
    io.to(data.roomId).emit("msg_rcvd", data); //send data to all including itself
    // socket.emit("msg_rcvd", data); sends data to only itself
    // socket.broadcast.emit("msg_rcvd", data); // sends data to all except itself
  });
});

app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/public"));

app.get("/chat/:roomid", async (req, res) => {
  const chats = await Chat.find({
    roomId: req.params.roomid,
  });
  console.log(chats);

  res.render("index", {
    id: req.params.roomid,
    chats: chats,
  });
});

server.listen(3000, async () => {
  console.log("server up on port 3000");
  await connect();
  console.log("mongo Db connected");
});
