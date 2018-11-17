var socket = io()
socket.on('connect',()=>{
    console.log('New User Connect !')
//For Create Message For Server
    // socket.emit('createMessage',{
    //     from:"Mohammad",
    //     text:"Hello Socket"
    // })
})
socket.on('disconnect',()=>{
    console.log('Disconnect from Server !')
})
//For Create Message to Server
socket.on('newMessage',(message)=>{
    console.log('newMessage',message)

    var li = jQuery('<li></li>')
    li.text(`${message.from} : ${message.text}`)
    jQuery('#messages').append(li)
})

jQuery('#messageForm').on('submit',function(e){
    e.preventDefault()

    socket.emit('createMessage',{
        from:'User',
        text:jQuery('[name=message]').val()
    })
})