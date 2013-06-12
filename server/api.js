"use strict";

var config = require("./config");
var nano = require("nano")(config.database);

exports.loadFoods = function(callback) {
    nano.view("foods", "name", function(err, body) {
        if (!err) {
            var results = [];
            body.rows.forEach(function(doc) {
                results.push(doc.value);
            });
            callback(results);
        }
    });
};

exports.searchFoods = function(input, callback) {
    nano.view("foods", "search", { limit: 10, key: input }, function(err, body) {
        if (!err) {
            var results = []
            body.rows.forEach(function(doc) {
                results.push({
                    id: doc.id,
                    name: doc.value
                });
            });
            callback(results);
        }
    });
};

exports.getFood = function(id, callback) {
    if (!id)
        callback(null);

    nano.view("foods", "id", { key: id, include_docs: true, limit: 1 }, function(err, body) {
        if (body.rows.length != 1)
            callback(null);
        callback(body.rows[0].doc);
    });
};

exports.addFood = function(food, callback) {
    if (!food || food.type != "food")
        callback(null);

    nano.insert(food, function(err, body) {
        callback(body);
    });    
};

exports.loadLog = function(date, callback) {
    nano.view("log", "date_full", { key: date, include_docs: true }, function(err, body) {
        var results = [];
        for (var i = 0; i < body.rows.length; i += 1) {
            results.push({ 
                log: body.rows[i].value.log, 
                food: body.rows[i].doc
            });
        }        
        callback(results);
    });
};

exports.logFood = function(log, callback) {
    if (!log || log.type != "log")
        callback(null);

    nano.insert(log, function(err, body) {
        callback(body)
    });
};

exports.deleteLog = function(id, rev, callback) {
    nano.get(id, function(err, body) {
        if (body && body.type == "log" && body._rev == rev) {
            nano.destroy(id, rev, function(err2, body2) {
                callback();
            });
        } else {
            callback();
        }
    });
};
    
exports.saveDay = function(day, callback) {
    if (!day || day.type != "day")
        callback();

    nano.insert(day, function(err, body) {
        callback();
    });
};
    
exports.getDay = function(date, callback) {
    nano.view("day", "date", { key: date }, function(err, body) {
        if (parsed.rows.length == 1)
            callback(body.rows[0].value);
        else
            callback(null);
    });
};

exports.getGoals = function(callback) {
    nano.view("goals", "all", function(err, body) {
        if (body.rows.length == 1)
            callback(body.rows[0].value);
        else
            callback(goal);
    });
};
    
exports.saveGoals = function(goal, callback) {
    if (!goal || goal.type != "goals")
        callback();
    
    nano.insert(goal, function(err, body) {
        callback
    });
};
