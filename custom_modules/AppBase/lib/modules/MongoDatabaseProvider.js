/**
 This file brings in the functionality to read Domain schema and give us the Domain objects. Interceptors are also defined here.
 */

    function Database(callback) {
    var _this = this;
    var path = require('path');
    var fs = require('fs');
    var mongoose = require("mongoose");
    this.connection = mongoose.createConnection( "mongodb://heroku:4_tI0o_dl6BM07GL1odMxnqcESXAhTE3bq1mlWGQ3nouw9wks5SMIHDEKa77qAeW4BtRtnsEJxoBgyB-3vHrRA@kahana.mongohq.com:10051/app26539068"
, {poolSize: _config.dataSource.mongo.poolSize});
    console.log("+++++++++++++++++++++++++++++++++++++++",this.connection);

    this.connection.on('error', function () {
        log.error(arguments);
        if (_config.dataSource.mongo.ignoreConnectionError) callback(_this);
    });
    this.connection.once('open', function () {


        callback(_this);
    });
    var models = {};
    var Domain = function (domainName) {

        var domainDescriptor = require(path.join(__appBaseDir, "domain", domainName));
       // console.log("cheking----------------------",domainDescriptor.methods);

        var schema = new mongoose.Schema(domainDescriptor.schema);
       // console.log("cheking----------------------",schema);


        for (var method in domainDescriptor.methods) {
            if (domainDescriptor.methods.hasOwnProperty(method)) {
                schema.methods[method] = domainDescriptor.methods[method];
            }
        }
        for (var staticMethod in domainDescriptor.static) {
            if (domainDescriptor.static.hasOwnProperty(staticMethod)) schema.statics[staticMethod] = domainDescriptor.static[staticMethod];
        }

        schema.statics.ensureAllManuallyDefinedSchemaIndexes = function () {
            for (var indexDescriptor in domainDescriptor.indexes) {

                if (domainDescriptor.indexes.hasOwnProperty(indexDescriptor)) {
                    schema.index(domainDescriptor.indexes[indexDescriptor]);
                }
            }

            _this.connection.model(domainName, schema).ensureIndexes(function (err,data) {
              // console.log("cheking----------------------",data);
                if (err) log.error(err);
            });
        };
        this.createModel = function () {

            return _this.connection.model(domainName, schema);
        }
    };
    this.getDomain = function (name) {
        if (!Boolean(models[name])) models[name] = new Domain(name).createModel();
        log.info("data base ");
      //  console.log(">>>>>>>>>>>>>>>>>>>"+name);
      return models[name];
    };
}


/**
 * @param {function} callback
 * @returns {Database}
 */
exports.getDatabase = function (callback) {
    return new Database(callback);
};
