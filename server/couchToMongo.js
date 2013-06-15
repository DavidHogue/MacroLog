"use strict";

var config = require("./config");
var nano = require("nano")(config.database);
var mongodb = require("mongodb");

function printCouchDocs() {
    nano.list({ include_docs: true }, function(err, body) {
        if (err) {
            console.log(err);
            return;
        }
        
        body.rows.forEach(function(row) {
            console.log(row.doc);
        });
        
        console.log(body.rows.length + " documents");    
    });
}

function printMongoDocs() {
    var server = new mongodb.Server("localhost", 27017, {});
    new mongodb.Db("test", server, { safe: false }).open(function(error, client) {
        if (error) throw error;
        var collection = new mongodb.Collection(client, "test");
        collection.find({}, { limit: 10 }).toArray(function(err, docs) {
            if(err) throw err;
            console.log("docs", docs);
        });
    });
}

printMongoDocs();