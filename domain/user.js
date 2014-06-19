var ObjectId = require('mongoose').Schema.ObjectId;
/*
 * Define the Schema of the collection (MongooseJS schema definition)
 * id property is implicit, no need to define.
 * */
exports.schema = {
    _id:{type:String,required:true},
    name: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true }},
    Dob:{type:Date,required:true},
    gender: { type: String, required: true },
    admin: Boolean,
    friends:Array,
    profileImgId:String,
    coverImgId:String,
    meta: {
        logins: { type: Number, default: 0},
        lastauth: { type: Date },
        lastmod: { type: Date, default: Date.now },
        attempts: { type: Number, default: 0, max: 5},
        lockuntil: { type: Date, expires: 60}
    },
    //timestamp of the time when the user was created
    timestampCreated: Number,

    //timestamp it was last updated
    timestampUpdated: Number

};

/*
 * Define the Indexes for this collection
 * */
exports.indexes = [
    {name: 1},
    {name: 1, age: 1}
];

/*
 * Define the static methods for this Domain object.
 * */
exports.static = {
    findByName: function (name, callback) {
        this.find({name: name}, callback);
    }
};
/*
 * the member functions are defined here for the document object.
 * */
exports.methods = {
    printName: function () {
        log.info("Name Is:", this.name);
    }
};