// Convert individual log documents to combined day documents
(function() {
    var api = require('api');
    var date = require("date");


    function copyProperties(from, to, skip) {
        for(var propName in from) {
        
            // No private properties
            if (propName.indexOf("_") == 0)
                continue;
                
            // Skip anything listed in the skip param
            if (skip && skip.length)
                for(var i = 0; i < skip.length; i++)
                    if (propName == skip[i])
                        continue;

            to[propName] = from[propName];
        }
    }

    function convertLog(data) {
        var results = [];
        for (var i = 0; i < data.length; i++) {
            var food = data[i].food;
            var log = data[i].log;
            var newLog = {};
            var newFood = {};
            
            copyProperties(log, newLog, ["type", "food_id"]);
            copyProperties(food, newFood, ["type"]);
            
            newLog.food = newFood;
            newLog.food.base_id = log.food_id;
            results.push(newLog);
        }
        return results;
    }

    $.when(api.loadLog(date.prettyDate()), api.getDay(date.prettyDate()))
        .done(function(logs, day) {
            if (!day) {
                day = { 
                    type: "day", 
                    log: [],
                    date: date.prettyDate()
                };
            }
            day.log = convertLog(logs);
     
            if (day._id)
                api.saveDay(day);
            else        
                api.addDay(day);
        });

})();



// Update all the dates to work around date bug
(function() {

    function getNewDate(date) {
        var dateParts = date.split("/");
        var month = parseInt(dateParts[0]);
        var newDate = (month + 1) + "/" + dateParts[1] + "/" + dateParts[2];
        return newDate;
    }

    function processDoc(doc) {
        if (!doc.date || doc.date.indexOf("4/") != 0) {
            var deferred = new $.Deferred();
            deferred.resolve();
            return deferred;
        }

        var newDate = getNewDate(doc.date);
        console.log(doc.date, newDate, doc._id);
        
        doc.date = newDate;
        return $.ajax(config.database + "/" + encodeURIComponent(doc._id), {
            data: JSON.stringify(doc),
            contentType: "application/json",
            type: "PUT"
        });
    }
    
    function main() {
        var config = require('config');
        $.ajax(config.database + "/_all_docs?include_docs=true", {
            data: JSON.stringify({}),
            contentType: "application/json",
            type: "POST"
        }).done(function(json) {
            var data = JSON.parse(json);
            
            // This may not look like it, but it is a loop that waits for ajax calls to complete;
            var i = 0;
            function step() {
                if (i < data.rows.length) {
                    var doc = data.rows[i++].doc;
                    processDoc(doc).done(step);
                }
            }
            step();
        });
    }
    
    main();
})();