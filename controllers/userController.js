var async=require('async');
exports.login = function (req, res) {
    if (req.user) {
        console.log("your profile-picture info",req.user._json.picture.data);

//log.info(req.user._json);
        userService.getUser(req.user._json.email, function (err, data) {
        })
            .on("data", function (users) {
                if (users.length > 0) {

                    users[0].friends=req.user._json.friends.data;

                    users[0].save(function(err,data){
                        if(!err)
                        {
                            res.render('account', {message: ''})

                        }
                    })
                }
                else {



                    var stack=[];
                  stack.push(getUserFbDetail);
                    //getUserFbDetail();
                   // stack.push(uploadInCloudinary);
                   //stack.push(createNewUser(req));
                    async.series(stack,function(result){
                        console.log('*********************',result)
                        userService.createUser( req.user._json.id,req.user._json.first_name + ' ' + req.user._json.last_name,
                            req.user._json.email,
                            req.user._json.gender,
                            new Date(),
                            req.user._json.friends.data,
                            result[0].profileImgId,
                            result[1].coverImgId,
                            function (err, data) {
                            })
                            .on("data", function (users) {
                                res.render('account', {message: 'first time login'})
                            })
                            .on("error", function (err) {
                                log.error(err)
                                res.render('index', {message: JSON.stringify(err)});
                            })

                    });
                   // console.log('*************************************',fbData.coverUrl)


                }
            })
            .on("error", function (err) {
                log.err(err)
                res.render('index', {message: JSON.stringify(err)});

            })
    } else {
        res.redirect('/');
    }
}
exports.logOut = function (req, res) {
    //req.user = null;
    log.info('user successfully logged out !!!');
    res.redirect('/')
}

exports.myConversation=function(req,res){
   userService.getmyConversation(req.user.id,req.body.targetId)
       .on('data',function(result){
          log.info(result)
           res.send(result);
       })
       .on('err',function(err){
           log.err(err)
           res.send(err);
       })

}

exports.saveMyProfileImgId=function(req,res){
   userService.saveMyProfileImgId(req.user.id,req.body.ImgId)
       .on('data',function(result){
          log.info(">>>>>>>>>>>>>>>>>>>>>>>>>",result)
           res.send(result);
       })
       .on('err',function(err){
           log.err(">>>>>>>>>>>>>>>>>>>>+>>>>>>",err)
           res.send(err);
       })

}

exports.getUser = function (req, res) {
    if (req.user) {
       log.info('searchin for !!!', req.user._json.email);
        userService.getUser(req.user._json.email)
            .on("data", function (users) {
                if (users.length > 0) {
                    res.send(users[0])
                }
                else {
                    res.send(null)

                }
            })
            .on("error", function (err) {
                res.send(err)

            })
    } else {
        res.send(null);
    }
}
function getUserFbDetail(clb){
var fbData={};
    var graph=require('fbgraph');
    graph.setAccessToken(accessTokenN);
    graph.extendAccessToken({
        "access_token":    accessTokenN
        , "client_id":      '592926297487335'
        , "client_secret":  'd326004d633895e9c3fa4393907efc33'
    }, function (err, facebookRes) {
        console.log(facebookRes);
        //use--"me?fields=picture"
        //"me?fields=picture.type(large)"
        graph.get( "me?fields=cover,picture.type(large)", function(err, res) {
           // console.log(res);
             // { picture: 'http://profile.ak.fbcdn.net/'... }
            //console.log(res.data.length); // { picture: 'http://profile.ak.fbcdn.net/'... }
            // profile._json.picture.data.url=res.picture.data.url;
            function a(callback){
                cloudinary.uploader.upload(res.picture.data.url,function(result) {
                    console.log(' cover images is getting uploaded')
                    callback(null,{"profileImgId":result.public_id})

                });
                //callback(null,"amit")
            }
           function b(callback){
                console.log('======================++=================================',res.picture.data.url); // { picture: 'http://profile.ak.fbcdn.net/'... }
                cloudinary.uploader.upload(res.cover.source, function(result) {
                    console.log(' profile images is getting uploaded')
                    callback(null,{"coverImgId":result.public_id})

                });
               //callback(null,"ajay")

           }
            var stack=[];
            stack.push(a)
            stack.push(b)
            async.series(stack,function(err,res){
           //  console.log('=======================================================',res); // { picture: 'http://profile.ak.fbcdn.net/'... }
           clb(res)
                            })


        });

    });
}



/*
function createNewUser(req,clb){

}*/

function uploadInCloudinary(url,clb){
    _cloudinary.uploader.upload(url, function(result,fbData) {
        console.log('images is getting uploaded')
        clb(result.public_id)
    });
}



