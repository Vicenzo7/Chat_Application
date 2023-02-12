const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("a user connected " + socket.id);

  socket.on("msg_send", (data) => {
    console.log(data);
    // io.emit("msg_rcvd", data); send data to all including itself
    // socket.emit("msg_rcvd", data); sends data to only itself
    socket.broadcast.emit("msg_rcvd", data); // sends data to all except itself
  });
});

app.use("/", express.static(__dirname + "/public"));

server.listen(3000, () => {
  console.log("server up on port 3000");
});
