const path = require('path');
const express = require('express')
const socketIO = require('socket.io') 
const http = require('http')
const publicPath = path.join(__dirname,'../public')
const port = process.env.port || 3000
const {generateMessage,generateLocationMessage} = require('../public/js/messages')
const {isRealString} = require('./validation')
var app = express()
var server = http.createServer(app)
var io = socketIO(server)

//BroadCasting Event
io.on('connection',(socket)=>{
    console.log('New User Connect')

    

    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('نام و اتاق مورد نظر را وارد کنید')
        }
        socket.join(params.room)
        socket.emit('newMessage',generateMessage('Admin','Welcome to the ChatRoom'))
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('ChatRoom',`${params.name} has joined!`))
        callback()
    })
    
//For Create Message to Client
    socket.on('createMessage',(message,callback)=>{
        console.log('Create Message',message)
        io.emit('newMessage',generateMessage(message.from,message.text))
        callback()
    })
//For Create Location Message        
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude,coords.longitude))
    })
//Disconnect Socket    
    socket.on('disconnect',()=>{
        console.log('User disconnected!')
    })
})

app.use(express.static(publicPath))

server.listen(port,()=>{
    console.log(`Server is Running on ${port}...!`)
})
