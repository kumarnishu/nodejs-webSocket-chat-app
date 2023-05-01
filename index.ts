import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";

const app = express.default();

app.get("/", (_req, res) => {
    res.send({ uptime: process.uptime() });
});

const server = http.createServer(app);
const io = new socketio.Server(server);

io.on('connection', client => {
    client.on('event', data => { console.log("someone connected");
     });
    client.on('disconnect', () => { console.log("someone disconnected") });
});

server.listen(5000, () => {
    console.log("Running at localhost:5000");
});

