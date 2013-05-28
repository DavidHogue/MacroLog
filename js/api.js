define(["config"], function(config) {

    "use strict";
    
    function loadFoods() {
        var deferred = new $.Deferred();

        $.ajax(config.database + "/_design/foods/_view/name", {
            type: "GET",
            data: { include_docs: true }
        }).done(function(data) {
            var parsed = JSON.parse(data),
                results = [],
                i,
                food;
            for (i = 0; i < parsed.total_rows; i++) {
                food = parsed.rows[i].value;
                food.calories = food.calories;
                food.fat = food.fat;
                food.carb = food.carb;
                food.protein = food.protein;
                results.push(food);
            }
            deferred.resolve(results);
        });

        return deferred;
    }
    
    function getFood(id) {
        var deferred = new $.Deferred();

        if (id) {
            $.ajax(config.database + "/" + id, {
                type: "GET"
            }).done(function(data) {
                var food = JSON.parse(data);
                deferred.resolve(food);
            });
        } else {
            deferred.resolve();
        }        

        return deferred;
    }
    
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
    
    return { 
        loadFoods: loadFoods,
        getFood: getFood,
        addFood: addFood,
        editFood: editFood,
        loadLog: loadLog,
        logFood: logFood,
        deleteLog: deleteLog
    };
});