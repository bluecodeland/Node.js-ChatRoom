var socket = io()
socket.on('connect',()=>{
    console.log('New User Connect !')

})
socket.on('disconnect',()=>{
    console.log('Disconnect from Server !')
})
//For Create New Text Message
socket.on('newMessage',(message)=>{
    var formatedTime = moment(message.createdAt).format('hh:mm a')
    var template = jQuery('#messageTemplate').html()
    var html = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formatedTime
    })

    jQuery('#messages').append(html)
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
//For Create New Location Message
socket.on('newLocationMessage',function(message){
    var formatedTime = moment(message.createdAt).format('hh:mm a')
    var template = jQuery('#locationMessageTemplate').html()
    var html = Mustache.render(template,{
        text:message.url,
        from:message.from,
        createdAt:formatedTime
    })
    jQuery('#messages').append(html)
})