
var async = require("async");

/*
 * This is the start point for BootStrap. This method is triggered externally from app.js when the instance is loaded.
 * This is only called once when the instance spins up.
 * */
var ObjectId = require('mongoose').Types.ObjectId;
var id=new ObjectId(1)

exports.init = function () {
    log.info("Executing Bootstrap");

    switch (__appEnv) {
        case "development":
            bootstrapForDevelopment();
            break;
        case "test":
            bootstrapForTest();
            break;
        case "production":
            bootstrapForProduction();
            break;
        case "qa":
            bootstrapForQa();
            break;
        default:
            log.info("No Bootstrap for the Environment:", __appEnv);
    }
};

/*
 * Bootstrap execution for the env "development"
 * */
function bootstrapForDevelopment() {
    var tasks = [];

    //Define the tasks in order of execution
    tasks.push(createSuperAdminUserIfDoesNotExist);
    async.series(tasks, function () {
        log.info("Finished executing Bootstrap for 'development'");
    });
}

/*
 * Bootstrap execution for the env "production"
 * */
function bootstrapForProduction() {
    var tasks = [];

    //Define the tasks in order of execution
    tasks.push(createSuperAdminUserIfDoesNotExist);

    async.series(tasks, function () {
        log.info("Finished executing Bootstrap for 'production'");
    });
}

/*
 * Bootstrap execution for the env "test"
 * */
function bootstrapForTest() {
    var tasks = [];

    //Define the tasks in order of execution
    tasks.push(createSuperAdminUserIfDoesNotExist);

    async.series(tasks, function () {
        log.info("Finished executing Bootstrap for 'test'");
    });
}

/*
 * Bootstrap execution for the env "qa"
 * */
function bootstrapForQa() {
    var tasks = [];

    //Define the tasks in order of execution
    tasks.push(createSuperAdminUserIfDoesNotExist);

    async.series(tasks, function () {
        log.info("Finished executing Bootstrap for 'qa'");
    });
}


/***********************************************************************************************
 *
 * Individual task methods are described below.
 *
 ***********************************************************************************************/

/*
 * Create A super admin user if does not exist.
 * */
console.log(typeof(user));
 function createSuperAdminUserIfDoesNotExist(callback) {
    var hash=bcrypt.hashSync('admin');
    user.findOne({ email: "ajay.mishra@gmail.com"}, function (err, obj) {
       // console.log(obj);

        if (err) log.error(err);
        else if (Boolean(obj)) callback();
        else {
            new  user({
                _id:'0',
                name:'admin',
                email:'ajay.mishra@gmail.com',
                Dob:new Date(),
                gender:'Male',
                admin:true,
                friends:[{_id:1,name:'sandeep'},{_id:2,name:'dheeraj'},{_id:3,name:'vibhor'}]

            }).save(function (err, user) {
                    if (err) log.error(err);
                    else log.debug("Created Super Admin user: ", user);
                    new message({
                        To:'Admin',
                        From:'Admin',
                        Data:'Hello Admin',
                        deliveredTime:new Date()
                    }).save(function(err,message){
                            if (err) log.error(err);
                            else log.debug("Created  Admin message: ",message);
                            callback();

                        })
                });

        }
    });
}


