"use strict";

var config = require("./config"),
    nano = require("nano")(config.database),
    MongoClient = require("mongodb").MongoClient,
    Q = require("Q");


function getCouchDocs() {
    var deferred = Q.defer();
    nano.list({ include_docs: true }, function(err, body) {
        if (err) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(body.rows.map(function(row) {
                return row.doc;
            }));
        }
    });
    return deferred.promise;
}

function printCouchDocs() {
    getCouchDocs()
    .then(function(docs) {
        docs.forEach(function(doc) {
            console.log(doc);
        });
    })
    .done();
}

function printDocs(docs) {
    docs.forEach(function(doc) {
        console.log(doc);
    });
    return docs;
}

function printDocTypes(docs) {
    
    var types = {};
    docs.forEach(function(doc) {
        var type = doc.type;
        if (!types[type])
            types[type] = 1;
        types[type]++;
    });
    
    var typesCount = 0;
    for (var type in types) {
        console.log(type, types[type]);
        typesCount++;
    }
    
    console.log(docs.length + " documents");    
    console.log(typesCount + " types");    
    return docs;
}

function mapCouchIdsToPlaceholders(docs) {
    return docs.map(function(doc) {
        doc.couch_id = doc._id;
        delete doc._id;
        doc.couch_rev = doc._rev;
        delete doc._rev;
        return doc;
    });
}

function connectToMongo() {
    var deferred = Q.defer();
    MongoClient.connect("mongodb://localhost:27017/macrolog", function(err, db) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(db);
        }
    });
    return deferred.promise;
}

function printMongoDocs(db) {
    var collection = db.collection("test");
    collection.find().toArray(function(err, items) {
        if (err) throw err;
        console.log(items);
    });
    return db;
}

function saveOrUpdate(docs, db) {
    var deferred = Q.defer();
    ["food", "log", "day", "goals"].forEach(function(type) {
        var collection = db.collection(type);
        docs.forEach(function(doc) {
            if (doc.type == type) {
                collection.update({ couch_id: doc.couch_id }, doc, { upsert: true, w: 1 }, function(err, result) {
                    if (err) throw err;
                });
            }
        });
    });
}

function updateReferenceIds(db) {
    var logCollection = db.collection("log");
    var foodCollection = db.collection("food");
    logCollection.find().toArray(function(err, result) {
        if (err) throw err;
        result.forEach(function(log) {
            if (typeof log.food_id == "string") {
                console.log("convert:", log.food_id);
                foodCollection.findOne({ couch_id: log.food_id }, function(err, food) {
                    if (err) throw err;
                    console.log("new id:", food._id);
                    log.food_couch_id = log.food_id;
                    log.food_id = food._id;
                    logCollection.update({ _id: log._id }, log, { upsert: true, w: 1 }, function(err, result) {
                        if (err) throw err;
                    });                    
                });
            } else {
                console.log("fine", { food_id: log.food_id, food_couch_id: log.food_couch_id });
            }
        });
    });
}

//getCouchDocs()
//    .then(mapCouchIdsToPlaceholders)
//    .then(printDocs)
//    .done();

//connectToMongo()
//    .then(printMongoDocs)
//    .done();

/*
Q.all([
    getCouchDocs()
        .then(printDocTypes)
        .then(mapCouchIdsToPlaceholders),
    connectToMongo()
]).then(function(args) {
    saveOrUpdate(args[0], args[1]);
}).done();
*/

connectToMongo()
    .then(updateReferenceIds)
    .done();
    