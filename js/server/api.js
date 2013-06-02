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

    nano.get(id, function(err, body) {
        callback(body);
    });
};
    
    /*
    
    function addFood(food) {
        var deferred = new $.Deferred();
    
        // Write to db.
        $.ajax(config.database, {
            data: JSON.stringify(food),
            contentType: "application/json",
            type: "POST"
        }).done(function () {
            deferred.resolve();
        });
        
        return deferred;
    }
    
    function editFood(food) {
        var deferred = new $.Deferred();
    
        // Write to db.
        $.ajax(config.database + "/" + food._id, {
            data: JSON.stringify(food),
            contentType: "application/json",
            type: "PUT"
        }).done(function () {
            deferred.resolve();
        });
        
        return deferred;
    }
    
    function loadLog(date) {
        var deferred = new $.Deferred();

        $.ajax(config.database + "/_design/log/_view/date_full", {
            type: "GET",
            data: {
                key: JSON.stringify(date),
                include_docs: true
            }
        }).done(function(data) {
            var parsed = JSON.parse(data),
                results = [],
                i,
                log,
                food;
            for (i = 0; i < parsed.rows.length; i += 1) {
                log = parsed.rows[i].value.log;
                food = parsed.rows[i].doc;
                results.push({ log: log, food: food });
            }
            
            deferred.resolve(results);
        });

        return deferred;
    }
    
    function logFood(log) {
        var deferred = new $.Deferred();

        $.ajax(config.database, {
            data: JSON.stringify(log),
            contentType: "application/json",
            type: "POST"
        }).done(function() {
            deferred.resolve();
        });
        
        return deferred;
    }
    
    function deleteLog(id, rev) {
        var deferred = new $.Deferred();

        $.ajax(config.database + "/" + encodeURIComponent(id) + "?rev=" + encodeURIComponent(rev), {
            data: JSON.stringify({ rev: rev }),
            contentType: "application/json",
            type: "DELETE"
        }).done(function() {
            deferred.resolve();
        });
        
        return deferred;
    }
    
    function saveDay(day) {
        var deferred = new $.Deferred();

        $.ajax(config.database + "/" + encodeURIComponent(day._id), {
            data: JSON.stringify(day),
            contentType: "application/json",
            type: "PUT"
        }).done(function() {
            deferred.resolve();
        });
        
        return deferred;
    }
    
    function addDay(day) {
        var deferred = new $.Deferred();

        $.ajax(config.database, {
            data: JSON.stringify(day),
            contentType: "application/json",
            type: "POST"
        }).done(function() {
            deferred.resolve();
        });
        
        return deferred;
    }
        
    function getDay(date) {
        var deferred = new $.Deferred();

        $.ajax(config.database + "/_design/day/_view/date", {
            data: { key: JSON.stringify(date) },
            type: "GET"
        }).done(function(data) {
            var parsed = JSON.parse(data);
            var day;
            if (parsed.rows.length == 1)
                day = parsed.rows[0].value;
            else
                day = null;
            deferred.resolve(day);
        });
        
        return deferred;
    }
    
    function getGoals() {
        var deferred = new $.Deferred();

        $.ajax(config.database + "/_design/goals/_view/all", {
            type: "GET"
        }).done(function(data) {
            var parsed = JSON.parse(data);
            var goal;
            if (parsed.rows.length == 1)
                goal = parsed.rows[0].value;
            else
                goal = null;
            deferred.resolve(goal);
        });
        
        return deferred;
    }    
    
    function saveGoals(goal) {
        var deferred = new $.Deferred(),
            url,
            method

        if (goal && goal._id) {
            url = config.database + "/" + encodeURIComponent(goal._id);
            method = "PUT";
        } else {
            url = config.database;
            method = "POST";
        }        
        
        $.ajax(url, {
            data: JSON.stringify(goal),
            contentType: "application/json",
            type: method
        }).done(function(response) {
            var data = JSON.parse(response);
            if (data.ok) {
                goal._id = data.id;
                goal._rev = data.rev;
            }
            deferred.resolve();
        });
        
        return deferred;
    }
    */