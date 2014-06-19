var passport = require('passport');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var AppBase = require('./custom_modules/AppBase');
var path = require('path');
var bcrypt=require('bcrypt-nodejs');
var cloudinary = require('cloudinary');
upload = require('jquery-file-upload-middleware');

var app = express();
// all environments
global.__appBaseDir = __dirname;
global.accessToken='';
//Get the Environment
global.__appEnv = process.env.NODE_ENV || "development";
console.log("Initializing with environment:", __appEnv);
//Initialize the config. Now the configurations will be available in _config global getter.
AppBase.initConfig({
    postProcess: function (config) {
        //Check if port is defined in environment then set that one.
        config.port = process.env.PORT || config.port;
        //More overrides
        return config;
    }});
//Initialize the Logger. this is available in the "log" global object.
var logOnStdOut = _config.logger.stdout.enabled;
AppBase.initLogger(function (message, level) {
    if (logOnStdOut) {
        //Print on console the fully formatted message
        console.log(message.fullyFormattedMessage, level);
    }
});

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use('/upload', upload.fileHandler());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({"secret": "ajaySecret"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function () {
    express.errorHandler.title = _config.appName;
    app.use(express.errorHandler());
});

//Export the bcrypt via getter in global
global.__defineGetter__("bcrypt", function () {
    return bcrypt;
});

//Export the app via getter in global
global.__defineGetter__("_app", function () {
    return app;
});

//Export the AppBase js via getter in global
global.__defineGetter__("_AppBase", function () {
    return AppBase;
});

//Export the passport via getter in global
global.__defineGetter__("_passport", function () {
    return passport;
});
//Export the cloudinary via getter in global
global.__defineGetter__("cloudinary", function () {
    return cloudinary;
});
//Export the upload via getter in global
global.__defineGetter__("_upload", function () {
    return upload;
});

AppBase.initDomains(function () {
    require("./conf/Bootstrap").init();
    AppBase.initServices();
})
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

require("./conf/URLMappings");
AppBase.initSocialLoginStrategy();
AppBase.initCloudneryConfig();
AppBase.inituploadConfig();
var server=http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var socketio=require('socket.io')
io = socketio.listen(server);
require('./socketI0/socket.js').startSocket();