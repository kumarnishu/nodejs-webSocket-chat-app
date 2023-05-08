"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const http = __importStar(require("http"));
const socketio = __importStar(require("socket.io"));
let users = [];
function formatMessage(username, text) {
    return {
        username,
        text,
        time: new Date().toLocaleTimeString()
    };
}
function userJoin(id, username, room) {
    let user = { id, username, room };
    users.push(user);
    return user;
}
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1)
        return users.splice(index, 1)[0];
}
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}
const app = express.default();
app.use(express.static("public"));
const server = http.createServer(app);
const io = new socketio.Server(server);
io.on('connection', socket => {
    //welcome message
    socket.emit('message', formatMessage('ChatCord Bot', 'Welcome to Chatcord'));
    //join room listen
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('message', formatMessage('ChatCord Bot', `${username} has joined the chat`));
        //send room and users
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    //listen to chat messages from from
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        }
    });
    //on disconnect
    socket.on('disconnect', (msg) => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(user.username, `${user.username}  has left the chat`));
            //send room and users
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});
server.listen(5000, () => {
    console.log("Running at localhost:5000");
});
