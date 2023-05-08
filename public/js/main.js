const socket = io()
const chatForm = document.getElementById('chat-form')
const roomName = document.getElementById('room-name')
const usersList = document.getElementById('users')

//get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
//join room
socket.emit('joinRoom', { username, room })

//get room and users
socket.on('roomUsers',({room,users})=>{
    outPutRoomName(room)
    outPutUsers(users)
})


console.log(username,room)
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    socket.emit('chatMessage', msg)
})

socket.on('message', (message) => {
    outputMessage(message)
})


function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
     <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
     ${message.text}
    </p>
    `;
    document.querySelector('.chat-messages').appendChild(div)
}



function outPutRoomName(room){
roomName.innerText=room
}
function outPutUsers(users) {
    usersList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}