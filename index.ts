import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";

let users: { id: string, username: string, room: string }[] = []

function formatMessage(username: string, text: string) {
    return {
        username,
        text,
        time: new Date().toLocaleTimeString()
    }
}

function userJoin(id: string, username: string, room: string) {
    let user = { id, username, room }
    users.push(user)
    return user
}

function getCurrentUser(id: string) {
    return users.find(user => user.id === id)
}

function userLeave(id: string) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1)
        return users.splice(index, 1)[0]
}

function getRoomUsers(room:string){
return users.filter(user=>user.room===room)
}

const app = express.default();
app.use(express.static("public"))


const server = http.createServer(app);
const io = new socketio.Server(server);

io.on('connection', socket => {
    //welcome message
    socket.emit('message', formatMessage('ChatCord Bot', 'Welcome to Chatcord'))


    //join room listen
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        socket.broadcast.to(user.room).emit('message', formatMessage('ChatCord Bot', `${username} has joined the chat`))

        //send room and users
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })

    //listen to chat messages from from
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage(user.username, msg))
        }
    })
    //on disconnect
    socket.on('disconnect', (msg) => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage(user.username, `${user.username}  has left the chat`))
            //send room and users
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
});

server.listen(5000, () => {
    console.log("Running at localhost:5000");
});

