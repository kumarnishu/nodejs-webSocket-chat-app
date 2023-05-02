const socket=io()
const chatForm = document.getElementById('chat-form')

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    console.log(msg)
    socket.emit('chatMessage', msg)
})


socket.on('message', (message) => {
    console.log(message)
    outputMessage(message)
})


function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
     <p class="meta">Brad <span>9:12pm</span></p>
                    <p class="text">
                       ${message}
                    </p>
                    `;
    document.querySelector('.chat-messages').appendChild(div)

}



