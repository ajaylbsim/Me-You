var ConfigManager = require("./modules/ConfigManager");
var Logger = require("./modules/Logger");
var MongoDatabaseProvider = require("./modules/MongoDatabaseProvider");
var fs = require("fs");
var path = require("path");
require("colors");

//Populate the configurations by reading the AppConfig as well as the Config.json files. The environment is considered.
exports.initConfig = function (options) {
    new ConfigManager(options, function (config) {
        Object.defineProperty(global, '_config', {
            get: function () {
                // console.log(config);
                return config;
            }
        });
    });
};

//Initialize teh logger for the application. Consumer is teh method which will consume the produces logs.
exports.initLogger = function (consumer) {
    global.log = new Logger(consumer, _config.logger);
};

//Init all database Models
exports.initDomains = function (callback) {
    MongoDatabaseProvider.getDatabase(function (db) {
        Object.defineProperty(global, '_db', {
            get: function () {
                return db;
            }
        });
        fs.readdir(path.join(__appBaseDir, "domain"), function (err, list) {
            if (err) log.error(err);
            else {
                list.forEach(function (item) {
                    var name = item.toString().replace(/\.js$/, "");
                    var model = db.getDomain(name);
                    model.ensureAllManuallyDefinedSchemaIndexes();
                    Object.defineProperty(global, name, {
                        get: function () {
                            return model;
                        }
                    });
                });
            }
            callback();
        });
    });
};
//Inject all Singleton Services
exports.initServices = function () {
    try {
        var list = fs.readdirSync(path.join(__appBaseDir, "services"));
        list.forEach(function (item) {
            var name = item.toString().replace(/\.js$/, "");
            var service = require(path.join(__appBaseDir, "services", name));

           // log.info("caling list  -----------  ",name);


            Object.defineProperty(global, name, {
                get: function () {
                    return service;
                }
            });
        });
    } catch (err) {
        log.error(err);
    }
};

//Add a emitter transform for functions.
Function.prototype.toEmitter = function () {
    console.log("for each userservices is executing while services has been acquired to pass each function to new function whher original will be called  by emitter in nexttick");
    var origFunc = this;
    return function () {
        console.log("this is new function which is putting services function in nexttick");
        var args = arguments;
        var emitter = new process.EventEmitter();
        process.nextTick(function () {
            origFunc.apply(emitter, args);
        });
        return emitter;
    }
};


exports.initSocialLoginStrategy = function (clb) {
    var FacebookStrategy = require('passport-facebook').Strategy;
    _passport.use(new FacebookStrategy({
            clientID: '592926297487335',
            clientSecret: 'd326004d633895e9c3fa4393907efc33',
            callbackURL: 'http://localhost:3001/fb_loginPassport/facebook/callback',
            profileFields: [ 'email','first_name', 'last_name','gender','photos','picture','friends']
        },
        function (accessTokenN, refreshToken, profile, done) {
      global.accessTokenN=accessTokenN;
        log.info("your profile info",profile);
       console.log("your profile-picture info",profile._json.picture.data);
//  console.log("yor friends info ",profile._json.friends);
            process.nextTick(function () {
                done(null, profile);
            })
        }));
    _passport.serializeUser(function (user, done) {
        done(null, user);
    });

    _passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    exports.doFilter = function () {
        var ejs = require('ejs');
        ejs.filters.add = function (obj, text) {


            return obj.split("").join(text);

        }


    }
    /*****************************
     social media login end
     *****************************/
}

exports.initCloudneryConfig=function(){

    cloudinary.config({
        cloud_name: 'mewithyou',
        api_key: '287239824888188',
        api_secret: 'ibl4trwGWOOuCtQu3b8GTdyvNYk'
    });


}


exports.inituploadConfig=function(){

    _upload.configure({
        uploadDir: __dirname + '/public/uploads',
        uploadUrl: '/uploads',
        imageVersions: {
            thumbnail: {
                width: 80,
                height: 80
            }
        }
    });

}



















