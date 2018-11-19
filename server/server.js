const path = require('path');
const express = require('express')
const socketIO = require('socket.io') 
const http = require('http')
const publicPath = path.join(__dirname,'../public')
const port = process.env.port || 3000
const {generateMessage,generateLocationMessage} = require('../public/js/messages')
const {isRealString} = require('./validation')
const {Users} = require('./user')

var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()
//BroadCasting Event
io.on('connection',(socket)=>{
    console.log('New User Connect')
    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('نام و اتاق مورد نظر را وارد کنید')
        }
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id,params.name,params.room)
        io.to(params.room).emit('updateUserList',users.getUserList(params.room))
        socket.emit('newMessage',generateMessage('Admin','Welcome to the ChatRoom'))
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('ChatRoom',`${params.name} has joined!`))
        callback()
    })
//For Create Message to Client
    socket.on('createMessage',(message,callback)=>{
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    })
//For Create Location Message        
    socket.on('createLocationMessage',(coords)=>{
        var user = users.getUser(socket.id)
        if(user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name, coords.latitude,coords.longitude))
        }
    })
//Disconnect Socket    
    socket.on('disconnect',()=>{
        var user = users.removeUser(socket.id)
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room))
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`))
        }
    })
})
app.use(express.static(publicPath))
//Server Port
server.listen(port,()=>{
    console.log(`Server is Running on ${port}...!`)
})
