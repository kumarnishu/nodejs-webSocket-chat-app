import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";

const app = express.default();
app.use(express.static("public"))

app.get("/", (_req, res) => {
    res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);
const io = new socketio.Server(server);

io.on('connection', socket => {
    socket.emit('message', "Welcome to ChatCord")
    socket.broadcast.emit('message',"A new users has joined the room")
    socket.on('chatMessage',msg=>io.emit("message",msg))
    socket.on('disconnect', () => { 
        io.emit('message',"someone disconnected") });
});

server.listen(5000, () => {
    console.log("Running at localhost:5000");
});

