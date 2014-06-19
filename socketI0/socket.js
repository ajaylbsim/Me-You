exports.startSocket = function () {
    //console.log('------------------------------------------- cool')
    var clients = {};
    var socketsOfClients = {};
    io.sockets.on('connection', function (socket) {
        socket.on('set username', function (userId) {
            if (clients[userId] === undefined) {
                // Does not exist ... so, proceed
                clients[userId] = socket.id;
                socketsOfClients[socket.id] = userId;
               // console.log('total users  =================  ', socketsOfClients);
                updateFrindsList(userId);
                userIdAvailable(socket.id, userId);
                userJoined(userId);
                broadcastOnline(userId);
            } else if (clients[userId] === socket.id) {
                // Ignore for now
            } else {
                userIdAlreadyInUse(socket.id, userId);
            }
        });
        socket.on('message', function (msg) {
            console.log('--------------------------------message found    -----------  ', msg)
            var srcUser;
            if (msg.inferSrcUser) {
                // Infer user name based on the socket id
                srcUser = socketsOfClients[socket.id];
            } else {
                srcUser = msg.source;
            }

            if (msg.target == "All") {
                // broadcast
                io.sockets.emit('message',
                    {"source": srcUser,
                        "message": msg.message,
                        "target": msg.target,
                         "message": msg.message,
                       "deliveredTime": msg.deliveredTime});
            } else {
                // Look up the socket id
              if(clients[msg.target])
              {
                  io.sockets.sockets[clients[msg.target]].emit('message',
                      {   "source": srcUser,
                          "message": msg.message,
                          "target": msg.target,
                          "deliveredTime": msg.deliveredTime});
                  console.log("message is send   to ", clients[msg.target])

              }else{
                  console.log("target is ofline so can't send message  ", clients[msg.target])

              }
                var messageObj=new message();
                messageObj.To=msg.target;
                messageObj.From=srcUser;
                messageObj.data=msg.message;
                messageObj.deliveredTime=new Date();
                messageObj.save(function(err,msgObj){
                    if(err)console.log(err);
                });
            }
        })
        socket.on('disconnect', function () {
            var uName = socketsOfClients[socket.id];
            console.log('==================*****************************disconnected********',uName)
            broadcastOfline(uName)
            delete socketsOfClients[socket.id];
            delete clients[uName];
            // relay this message to all the clients
            userLeft(uName);
        })
    })

    function userJoined(uName) {
        Object.keys(socketsOfClients).forEach(function (sId) {
            io.sockets.sockets[sId].emit('userJoined', { "userId": uName, "userList": socketsOfClients});
        })
    }


    function updateFrindsList(userId) {
        Object.keys(socketsOfClients).forEach(function (sId) {
            userService.findFriends(userId)
                .on('data', function (friends) {
                    if (friends.length && friends[0].friends.length) {
                        //initilizig status
                        friends[0].friends.forEach(function (obj) {
                            obj.status = false;

                        });


                        for (var key in clients) {
                            friends[0].friends.forEach(function (obj) {
                                if (key == obj.id) {
                                    log.info(">>>>>>>>>>>>>>>>>>>>>>online is >>>>>>>>>>>>>>", obj.name);

                                    obj.status = true;
                                }


                            })
                        }
                    }
                    io.sockets.sockets[sId].emit('updateFrindsList', {"userList": friends[0].friends});

                })
                .on('err', function () {

                    log.error('error occured !!!!');

                })
        })
    }

    function userLeft(uName) {
        io.sockets.emit('userLeft', { "userId": uName });
    }

    function userIdAvailable(sId, uName) {
        setTimeout(function () {
            console.log('Sending welcome msg to ' + uName + ' at ' + sId);
            io.sockets.sockets[sId].emit('welcome', { "userId": uName, "currentUsers": JSON.stringify(Object.keys(clients)) });

        }, 500);
    }

    function userIdAlreadyInUse(sId, uName) {
        setTimeout(function () {
            io.sockets.sockets[sId].emit('error', { "userIdInUse": true });
        }, 500);
    }

    function broadcastOnline(sId) {
        io.sockets.emit('catchOnlineFriends',
            {
                "id": sId
            });
        setTimeout(function () {

        }, 500);
    }
    function broadcastOfline(sId) {
        io.sockets.emit('catchOflineFriends',
            {
                "id": sId
            });
        setTimeout(function () {

        }, 500);
    }

}