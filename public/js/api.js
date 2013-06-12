define(["config"], function(config) {

    "use strict";
    
    /*
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
            for (i = 0; i < parsed.rows.length; i++) {
                food = parsed.rows[i].value;
                results.push(food);
            }
            deferred.resolve(results);
        });

        return deferred;
    }
    */
    
    function searchFoods(input) {
        return $.ajax(config.api + "/food/search/" + encodeURIComponent(input));
    }
    
    function getFood(id) {
        return $.ajax(config.api + "/food/id/" + id);
    }
    
    function addFood(food) {
        return $.ajax(config.api + "/food/save", {
                    data: JSON.stringify(food),
                    contentType: "application/json",
                    type: "POST"
                });
    }
    
    function editFood(food) {
        return addFood(food); // These have been combined with the node server api
    }
    
    function loadLog(date) {
        return $.ajax(config.api + "/log/" + encodeURIComponent(date));
    }
    
    function logFood(log) {
        return $.ajax(config.api + "/log/save", {
                    data: JSON.stringify(log),
                    contentType: "application/json",
                    type: "POST"
                });
    }
    
    function deleteLog(id, rev) {
        return $.ajax(config.api + "/log/delete/" + encodeURIComponent(id) + "/" + encodeURIComponent(rev), {
                    type: "DELETE"
                });
    }
    
    function saveDay(day) {
        return $.ajax(config.api + "/day/save", {
            data: JSON.stringify(day),
            contentType: "application/json",
            type: "POST"
        });
    }
    
    function addDay(day) {
        return saveDay(day); // These have been combined with the node server api
    }

    function getDay(date) {
        return $.ajax(config.api + "/day/" + encodeURIComponent(date));
    }
    
    function getGoals() {
        return $.ajax(config.api + "/goals");
    }    
    
    function saveGoals(goal) {
        return $.ajax(config.api + "/goals/save", {
                    data: JSON.stringify(goal),
                    contentType: "application/json",
                    type: "POST"
                });
    }
        
    return { 
        //loadFoods: loadFoods,
        searchFoods: searchFoods,
        getFood: getFood,
        addFood: addFood,
        editFood: editFood,
        loadLog: loadLog,
        logFood: logFood,
        deleteLog: deleteLog,
        saveDay: saveDay,
        addDay: addDay,
        getDay: getDay,
        getGoals: getGoals,
        saveGoals: saveGoals
    };
});