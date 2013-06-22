"use strict";

var config = require("./config"),
    MongoClient = require("mongodb").MongoClient,
    ObjectID = require('mongodb').ObjectID,
    Q = require("q");
    
var db;
MongoClient.connect(config.mongoConnectionString, function(err, result) {
    if (err) throw err;
    db = result;
});

// Is this still needed?
exports.loadFoods = function(callback) {
    var collection = db.collection("food");
    collection.find().toArray(function(err, results) {
        if (err) throw err;
        callback(results);
    });
};

exports.searchFoods = function(input, callback) {
    var collection = db.collection("food");
    collection.find({ "name": new RegExp(input, "i") }).limit(10).toArray(function(err, docs) {
        if (err) throw err;
        callback(docs);
    });    
};

exports.getFood = function(id, callback) {
    var collection = db.collection("food");
    collection.findOne({ _id: ObjectID(id) }, function(err, food) {
        if (err) throw err;
        callback(food);
    });
};

exports.addFood = function(food, callback) {
    var collection = db.collection("food");
    food._id = ObjectID(food._id);
    collection.update({ _id: food._id }, food, true, function(err, result) {
        if (err) throw err;
        callback(result);
    });
};

exports.loadLog = function(date, callback) {
    var collection = db.collection("log");
    var foodCollection = db.collection("food");
    collection.find({ date: date }).toArray(function(err, docs) {
        if (err) throw err;
        
        var results = [];

        var i = 0;
        var promises = []
        docs.forEach(function(doc) {
            if (!doc) return;

            console.log(doc);
            promises.push(
                Q.npost(foodCollection, "findOne", [{ _id: new ObjectID(doc.food_id) }])
                    .then(function(food) {
                        results.push({ 
                            log: doc, 
                            food: food
                        });
                    })
            );
        });
        
        Q.all(promises).done(function() {
            callback(results);
        });
    });
};

exports.logFood = function(log, callback) {
    var collection = db.collection("log");
    collection.update({ _id: new ObjectID(log._id) }, log, { upsert: true }, function(err, result) {
        if (err) throw err;
        callback(result);
    });
};

exports.deleteLog = function(id, rev, callback) {
    var collection = db.collection("log");
    collection.remove({ _id: new ObjectID(id) }, function(err, result) {
        if (err) throw err;
        callback();
    });
};
    
exports.saveDay = function(day, callback) {
    var collection = db.collection("day");
    collection.update({ _id: new ObjectID(day._id) }, day, true, function(err, result) {
        if (err) throw err;
        callback();
    });
};
    
exports.getDay = function(date, callback) {
    var collection = db.collection("day");
    collection.findOne({ date: date }, function(err, result) {
        callback(result);
    });
};

exports.getGoals = function(callback) {
    var collection = db.collection("goal");
    collection.findOne(function(err, result) {
        if (err) throw err;
        callback(result);
    });
};
    
exports.saveGoals = function(goal, callback) {
    var collection = db.collection("goal");
    collection.update({ _id: new ObjectID(goal._id) }, goal, true, function(err, result) {
        if (err) throw err;
        callback();
    });
};
