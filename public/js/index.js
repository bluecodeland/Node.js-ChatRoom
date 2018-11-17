var socket = io()
socket.on('connect',()=>{
    console.log('New User Connect !')
//For Create Message For Server
    socket.emit('createMessage',{
        from:"Mohammad",
        text:"Hello Socket"
    })
})
socket.on('disconnect',()=>{
    console.log('Disconnect from Server !')
})
//For Create Message to Server
socket.on('newMessage',(message)=>{
    console.log('newMessage',message)
})