"use strict";

var config = require("./config"),
    nano = require("nano")(config.database),
    MongoClient = require("mongodb").MongoClient,
    ObjectID = require('mongodb').ObjectID,
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
    console.log("saving data");
    var promises = [];
    ["food", "log", "day", "goals"].forEach(function(type) {
        var collection = db.collection(type);
        var update = Q.nbind(collection.update, collection)
        docs.forEach(function(doc) {
            if (doc.type == type) {
                promises.push(update({ couch_id: doc.couch_id }, doc, { upsert: true, w: 1 }));
            }
        });
    });
    return Q.all(promises).then(function() {
        return db;
    });
}

function updateReferenceIds(db) {
    console.log("Updating food_id references");
    var logCollection = db.collection("log");
    var foodCollection = db.collection("food");
    
    var deferred = Q.defer();
    logCollection.find().toArray(function(err, result) {
        if (err) throw err;
        console.log(result.length, " logs found");
        var promises = []
        var findOne = Q.nbind(foodCollection.findOne, foodCollection);
        result.forEach(function(log) {
            if (typeof log.food_id != "string")
                return;
                
                
            promises.push(findOne({ couch_id: log.food_couch_id }).then(function(food) {
                if (err) throw err;
                if (!food) return;
                if (log.food_id == food._id) return;
                console.log("new id:", food._id);
                log.food_couch_id = log.food_id;
                log.food_id = food._id;
                var id = log._id;
                console.log(id, typeof id);
                if (typeof id == "string")
                    id = new ObjectID(id);
                logCollection.update({ _id: id }, log, { upsert: true, w: 1 }, function(err, result) {
                    if (err) throw err;
                });                    
            }));
        });
        Q.all(promises).done(function() {
            console.log("Done updating references");
            deferred.resolve();
        });
    });
    return deferred.promise;
}

//getCouchDocs()
//    .then(mapCouchIdsToPlaceholders)
//    .then(printDocs)
//    .done();

//connectToMongo()
//    .then(printMongoDocs)
//    .done();

Q.all([
    getCouchDocs()
        .then(printDocTypes)
        .then(mapCouchIdsToPlaceholders),
    connectToMongo()
]).spread(saveOrUpdate)
.then(updateReferenceIds)
.done(function() {
    process.exit(0);
});
