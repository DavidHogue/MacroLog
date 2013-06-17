"use strict";

var config = require("./config"),
    MongoClient = require("mongodb").MongoClient;
    
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
    collection.findOne({ _id: id }, function(err, food) {
        if (err) throw err;
        callback(food);
    });
};

exports.addFood = function(food, callback) {
    var collection = db.collection("food");
    collection.update({ _id: food._id }, food, true, function(err, result) {
        if (err) throw err;
        callback();
    });
};

exports.loadLog = function(date, callback) {
    var collection = db.collection("log");
    collection.find({ date: date }).toArray(function(err, result) {
        if (err) throw err;
        callback(result);
    });
};

exports.logFood = function(log, callback) {
    var collection = db.collection("log");
    collection.insert(log, function(err, result) {
        if (err) throw err;
        callback();
    });
};

exports.deleteLog = function(id, rev, callback) {
    var collection = db.collection("log");
    collection.remove({ _id: id }, function(err, result) {
        if (err) throw err;
        callback();
    });
};
    
exports.saveDay = function(day, callback) {
    var collection = db.collection("day");
    collection.update({ _id: day._id }, day, true, function(err, result) {
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
    collection.update({ _id: goal._id }, goal, true, function(err, result) {
        if (err) throw err;
        callback();
    });
};
