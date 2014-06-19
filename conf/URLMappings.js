var controllers = {
    user: require("../controllers/userController")

};
/********************************************************************************************************************************
 * social media authentication
 *********************************************************************************************************************************/
_app.get('/auth/facebook', _passport.authenticate('facebook',{ scope: ['read_stream', 'publish_actions','email','user_friends','user_photos '],  profileFields: [ 'email','first_name', 'last_name','gender','photos','picture','friends'] }));
_app.get('/fb_loginPassport/facebook/callback', _passport.authenticate('facebook', { failureRedirect: '/fail', successRedirect: '/FBlogin'}));

_app.get('/FBlogin',controllers.user.login);
_app.get('/fail',function(req,res){
    res.render('fail')
});

/********************************************************************************************************************************
 * user login
 *********************************************************************************************************************************/
_app.post('/token',function(req,res){


    var params = cloudinary.utils.sign_request({
            timestamp: cloudinary.utils.timestamp(),
            transformation: "c_limit,h_500,w_500",//whatever options you want here per cloudinary docs
            format: "jpg"
        },
        {
            api_key: "yyyyyy",
            api_secret: "xxxxxxxx"
        });

    res.json(params);

    console.log('res is gen',params);
    //res.send("cool")
});
_app.get('/logout',controllers.user.logOut);
_app.post('/getUser',controllers.user.getUser);
_app.get('/chat',function(req,res){
});
_app.post('/myConversation',controllers.user.myConversation);
_app.post('/saveMyProfileImgId',controllers.user.saveMyProfileImgId);
