var myApp = angular.module("myApp", ["ngRoute",'ngRoute',
    'cloudinary',
    'photoAlbumAnimations',
    'photoAlbumControllers',
    'photoAlbumServices']);
User = null;
myApp.directive('customPopover', function () {
    return {
        restrict: 'A',
        template: '<span>change</span>',
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;
            $(el).popover({
                trigger: 'click',
                html: true,
                content:'<a href="#/upload">upload</a>',
                placement: attrs.popoverPlacement
            });
        }
    };
});

myApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/account", {
        templateUrl: "account.html",
        controller: "coolCtrl",
        resolve: {
            photoList: function($q, $rootScope, album) {
                if (!$rootScope.serviceCalled) {
                    return album.photos({}, function(v){
                        $rootScope.serviceCalled = true;
                        $rootScope.photos = v.resources;
                    });
                } else {
                    return $q.when(true);
                }
            }
        }})
        .when("/profile", {
            templateUrl: "profilePage.html", controller: "profileCtrl"})
        .when("/chat", {
            templateUrl: "chat2.html", controller: "chatCtrl"})
        .when("/upload", {
            templateUrl: 'photo-upload.html',
            controller: 'photoUploadCtrl'
        })

        .otherwise({redirectTo: "/profile"})
}])

myApp.controller("mainCtrl", ["$scope", "$http", "$location", "$window", "$rootScope", function ($scope, $http, $location, $window, $rootScope) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>mainCtrl >>>>>>>>>>>>>>>>>>>>s");
    $rootScope.user;
    $rootScope.friends = [];
    $http.post('getUser').success(function (user) {
        console.log('user found is ----  ', user);
        User = user;
        if (user) {
            $rootScope.user = user;
            $rootScope.friends = user.friends;
            $rootScope.user.profileImg = 'http://res.cloudinary.com/mewithyou/image/upload/fl_progressive,f_auto,w_40,h_40,g_faces,c_fill,e_improve,r_max/' + $rootScope.user.profileImgId+".png"
            $rootScope.user.profilePic = 'http://res.cloudinary.com/mewithyou/image/upload/fl_progressive,f_auto,w_188,h_188,g_faces,c_fill,e_improve,r_max/' + $rootScope.user.profileImgId+".png"
            //$rootScope.user.profileImg='http://res.cloudinary.com/mewithyou/image/upload/fl_progressive,f_auto,w_50,h_50,g_faces,c_fill,e_improve,r_max,bo_4px_solid_white/'+$rootScope.user.profileImgId
            //$rootScope.user.profileImgId='http://res.cloudinary.com/mewithyou/image/upload/w_350,h_350/'+$rootScope.user.profileImgId
            $rootScope.user.coverImgId = 'http://res.cloudinary.com/mewithyou/image/upload/w_950,h_450/' + $rootScope.user.coverImgId+".png"
            $rootScope.friends.forEach(function (obj) {
                console.log("object is------------------", obj)
                obj.myStyle = {'background-color': 'blue', 'margin-top': '10px', 'margin-left': '5px', 'height': '14px'}
                obj.status = false;

            })

            $location.path('profile');
        }
        else {
            console.log('user found is ----  ***********', user);
            $window.location = "/";
        }
    });

}])

myApp.controller("coolCtrl", ["$scope", "$http", function ($scope, $http) {
    console.log("cool controller executed");
}])

myApp.controller("profileCtrl", ["$scope", "$http", function ($scope, $http) {
    $scope.status = [];
    $scope.personalDetails = [];
    $scope.InterestClass = 'pull-right beforeEdit';
    $scope.PersonalDetailsClass = 'pull-right beforeEdit';
    $scope.relationShipStatus="Single";
    $scope.edit

    $scope.changeRelationShipStatus=function(obj){
        console.log('going to change status !!',obj)
        $scope.relationShipStatus=obj.target.innerText;
        console.log('going to change status !!',$scope.relationShipStatus)
        $apply(function(){
            $scope.edit=false;

        })


    }
    $scope.update = function (index) {
        console.log(index);
        $scope.status = [];
        $scope.InterestClass = 'pull-right afterEdit';
        $scope.status[index] = 'true';
    }
    $scope.updatePersonalDetails = function (index) {
        console.log(index);
        $scope.personalDetails = [];
        $scope.personalDetails[index] = 'true';
        $scope.PersonalDetailsClass = 'pull-right afterEdit';

    }
    $scope.changeClass = function (classname) {
        if (classname == 'InterestClass') {
            $scope.status = [];
        }
        else {
            $scope.personalDetails = [];
        }
        $scope[classname] = 'pull-right beforeEdit';
    }

    console.log("profile controller executed");
}])

myApp.controller("chatCtrl", ["$scope", "$http", "socket", "$rootScope", "$timeout","date", function ($scope, $http, socket, $rootScope, $timeout,date) {
    console.log("chat controller executed");
    $scope.MessageBox = [];
    $scope.message;
    $scope.to;
    $scope.To_name;


    $scope.startChatTo = function (event) {
        console.log(event)

        if ($scope.To_name != event.target.text.trim()) {
            $scope.MessageBox = [];
            $scope.message = "";
            $scope.targetId = "";
            $scope.To_name = event.target.text.trim();
            $rootScope.friends.forEach(function (obj) {
                if (obj.name.trim() == $scope.To_name) {
                    $scope.targetId=obj.id;
                    console.log("message  receiver ststus   ", obj.status, obj.name);

                    if (obj.status == true) {
                        $scope.to = obj.id;
                        console.log("message can  be sent ", $scope.to);

                    }
                    else {
                        $scope.to = "";
                        console.log("message can't be sent  $scope.to is empty  ", $scope.to);
                    }

                }

            })
        }
     //getting all messages of user
     $http.post('myConversation',{targetId:$scope.targetId})
         .success(function(messageArr){
             console.log('received messages' ,messageArr)
             $scope.MessageBox = [];
             messageArr.forEach(function(obj){
             $rootScope.friends.forEach(function (friend) {
                 if(User._id==obj.From)
                 {
                     obj.from=User.name;

                 }
                 else if(friend.id==obj.From)
                 {
                     obj.from=friend.name;
                 }

             })
                 obj.deliveredTime=date.format(obj.deliveredTime)
                 obj.message=obj.data;
                 $scope.MessageBox.push(obj)



             })
         })



    }

    $scope.addMessage = function (event) {
        // $scope.FriendBox=[];
        // $scope.MyBox=[];
        // $scope.from=User.name;
        $scope.msg = {};
        $scope.msg.from = User.name;
        $scope.msg.message = $scope.message;
        $scope.msg.deliveredTime =new Date();
        $scope.msg.deliveredTime =date.format(new Date(  $scope.msg.deliveredTime))
        $scope.MessageBox.push($scope.msg);
        console.log('message sent is  to  ', $scope.to + "   message   is ", $scope.message);
        if ($scope.to != '') {
            socket.emit('message',
                {
                    "inferSrcUser": true,
                    "source": User._id,
                    "message": $scope.message || 'hello blank text',
                    "target": $scope.to || "",
                    "deliveredTime":$scope.msg.deliveredTime
                }, function () {
                    console.log('message emited')
                    $scope.message = ""

                });
        } else {

            console.log('...................................................  target empty');
        }


        console.log("addmnessage executed ", $scope.message)
    }

    socket.on('connect', function () {

        socket.userId = User._id;
        socket.emit('set username', socket.userId, 'ajay kumar');

        socket.on('message', function (msg) {
            $rootScope.friends.forEach(function (obj) {
                if (obj.id == msg.source) {
                    $scope.to = obj.id;
                    $scope.To_name = obj.name;
                    msg.from = obj.name;


                    console.log("MESSGE TO  ------matched-------------- ", $scope.to);

                }
            });
            msg.deliveredTime =date.format(new Date( msg.deliveredTime))
            $scope.MessageBox.push(msg);

            console.log("message  recived --------- ", $scope.FriendBox)

        });
        socket.on('userJoined', function (msg) {

            console.log("user has joined ", msg.userName);
            console.log("total usern list is  ", msg.userList);
            //      $('#message').append('<li>' + msg.userName + '</li><br>');
        });

        socket.on('updateFrindsList', function (frindsList) {
            console.log("going to add ", frindsList);
            frindsList.userList.forEach(function (obj) {
                $rootScope.friends.forEach(function (friend) {
                    // console.log('for         ',obj.name,obj.id==friend.id)&(obj.status==true);
                    if ((obj.id == friend.id) & (obj.status == true)) {
                        friend.myStyle = {'background-color': 'green', 'margin-top': '10px', 'margin-left': '5px', 'height': '14px'}
                        friend.status = true;
                    }
                    else {
                        //obj.myStyle={'background-color':'blue','margin-top':'10px','margin-left': '5px','height': '14px'}

                    }
                })

            })
            $scope.frindsList = frindsList.userList;
        });


        socket.on('catchOnlineFriends', function (onlineUser) {
            console.log(" the person has appeared online ", onlineUser);
            $rootScope.friends.forEach(function (obj) {
                if (obj.id == onlineUser.id) {

                    obj.myStyle = {'background-color': 'green', 'margin-top': '10px', 'margin-left': '5px', 'height': '14px'}
                    obj.status = true;
                }
            })
        });
        socket.on('catchOflineFriends', function (oflineUser) {
            console.log(" the person  went ofline ", oflineUser);
            $rootScope.friends.forEach(function (obj) {
                if (obj.id == oflineUser.id) {

                    obj.myStyle = {'background-color': 'blue', 'margin-top': '10px', 'margin-left': '5px', 'height': '14px'}

                }
            })
        });
    });

}])

myApp.factory('socket', function ($rootScope) {
    socket = io.connect('http://192.168.0.100:3001/');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});



myApp.factory('date',function(){

var d={}
   d.format= function (date){

        var day=new Date(date);
        day=day.toString('yyyy-MM-dd');
        return day.slice(0,25);
    }
    return d

})
