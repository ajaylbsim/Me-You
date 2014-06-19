exports.getUser = function (email) {
    var emitter = this;
    user.find({email: email}, function (err, user) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", user)
    })
}.toEmitter();

exports.findFriends = function (id) {
    var emitter = this;
    user.find({_id: id},{friends:1}, function (err, friends) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data",friends)
    })
}.toEmitter();

exports.createUser = function (id,name,email,gender,Dob,friends,profileImgId,coverImgId) {
    console.log('---------------------------------');
    console.log(id);
    console.log(name);
    console.log(email);
    console.log(gender);
    console.log(Dob);
    console.log(friends);
    var emitter = this;
    var userObj = new user()
    userObj._id = id||"";
    userObj.name = name||"";
    userObj.email = email||"";
    userObj.gender = gender||"";
    userObj.Dob = Dob||12;
    userObj.friends =friends;
    userObj.profileImgId =profileImgId;
    userObj.coverImgId =coverImgId;
    userObj.save(function (err, user) {
        if (err) emitter.emit("error", err);
        else emitter.emit("data", user)
    });
}.toEmitter();


exports.getmyConversation=function(to,from){
    var emitter=this;
    message.find({$or:[{$and:[{To:to},{From:from}]},{$and:[{To:from},{From:to}]}]},function(err,messages){
        if(err) emitter.emit('err',err)
        else emitter.emit('data',messages)

    })
}.toEmitter()

exports.saveMyProfileImgId=function(id,ImgId){
    var emitter=this;
    console.log('>>>>>>>>>>>>>',id,ImgId)

    user.update({_id:id},{profileImgId:ImgId},function(err,ImgId){
        if(err) emitter.emit('err',err)
        else emitter.emit('data',ImgId)

    })
}.toEmitter()