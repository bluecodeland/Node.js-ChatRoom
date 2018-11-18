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
    }, function(){
        jQuery('[name=message]').val('')
    })
})

var locationButton = jQuery('#sendLocation')
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geo Location not On')
    }
    locationButton.attr('disabled','disabled').text('Sending Location...')
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location')
        socket.emit('createLocationMessage',{
            latitude:position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(){
        locationButton.removeAttr('disabled').text('Send Location')
        alert('Unable to fetch Location !')
    })
})

socket.on('newLocationMessage',function(message){
    var li =jQuery('<li></li>')
    var a = jQuery('<a target="_blank">My Current Position </a>')

    li.text(`${message.from}: `)
    a.attr('href',message.url)
    li.append(a)
    jQuery('#messages').append(li)
})