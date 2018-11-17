const path = require('path');
const express = require('express')
const socketIO = require('socket.io') 
const http = require('http')
const publicPath = path.join(__dirname,'../public')
const port = process.env.port || 3000

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

//BroadCasting Event
io.on('connection',(socket)=>{
    console.log('New User Connect')

    socket.emit('newMessage',{
        from:"Admin",
        text:"Welcome to the ChatRoom",
        createdAt:new Date().getTime()
    })

    socket.broadcast.emit('newMessage',{
        from:"ChatRoom",
        text:"New User Joind",
        createdAt:new Date().getTime()
    })
//For Create Message to Client
    socket.on('createMessage',(message)=>{
        console.log('Create Message',message)
        io.emit('newMessage',{
            from:message.from,
            text:message.text,
            createdAt:new Date().getTime()
        })

        // socket.broadcast.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createdAt:new Date().getTime()
        // })
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

