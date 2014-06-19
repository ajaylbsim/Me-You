var socket = null;
function switchRoom(e) {
    //console.log(" please switch me to room !!",socket)
    if (socket && socket.room) {
        console.log(" please switch me to room !!", e.target.innerText)
        socket.emit('changeRoom', e.target.innerText);
    }
}
$(document).ready(function () {
    socket = io.connect('http://192.168.0.101:3001/')
    socket.on('connect', function () {
        socket.username = "";

        /*
         socket.on('message', function (data) {
         $('#message').append('<li>' + data + '</li><br>');
         })*/
        $('#add').click(function () {

            myUserName = $('#name').val()
            socket.emit('set username', $('#name').val(), 'ajay kumar');
            socket.username = $('#name').val();
            if (socket.username != "") {
                //socket.emit('addme', socket.username)
            }

            // $('input#msg').val("");
        })


        socket.on('message', function (msg) {
            console.log('message for you >>>>>>>>>>>>>>>>>>  ', msg);
            $('#message').append('<li>' + '<b>' + msg.source + '  To  ' + '</b>'+'<b>' + msg.target + '</b>'+'   ' + msg.message + '   ' +  '</li><br>');
        });
        socket.on('userJoined', function (msg) {

            console.log("user has joined ", msg.userName);
            console.log("total usern list is  ", msg.userList);
            //      $('#message').append('<li>' + msg.userName + '</li><br>');
        });

        socket.on('updateFrindsList', function (frindsList) {
            console.log("going to add  frindsList ");
            frindsList = frindsList.userList;

            if (frindsList != null) {
                $('#frindsList').empty();
                for (var key in frindsList) {
                    if (myUserName != frindsList[key])
                    {
                        var name= frindsList[key];
                        $('#frindsList').append('<li id="friend"  value=' + frindsList[key] + '><a  href="#" onclick="sendMessage(event,name)">' + frindsList[key] + '</a></li>')
                    }

                }


            }
        });


    });
});

function sendMessage(event,name){


    console.log(event,name)
    var to = event.target.innerHTML
    console.log("MESSGE TO  "+to);
    var txt=prompt("say something !!");
    socket.emit('message',
        {
            "inferSrcUser": true,
            "source": "",
            "message":txt||'hello blank text',
            "target": to||name
        });
    var message = "";
//          message = prompt("say something");
    if ((message != "") && (socket.username != "")) {
        socket.emit('broadCastMessage', socket.username, message)
    }


}

