 define(["api", "jquery", "bootstrap"], function(api, $) {
    "use strict";
 
    var nameToIdMap,
        selected;
 
    function search(query, process) {
        // Call the API
        api.searchFoods(query).done(function(results) {
            var foods = [],
                i,
                food;
            // Map names back to ids for later.
            nameToIdMap = {};
            for (i = 0; i < results.length; i++) {
                food = results[i];
                nameToIdMap[food.name] = food._id;
                
                // Add the name to the list for the drop down.
                foods.push(food.name);
            }
            
            // Show the list
            process(foods);
        });
    }
    
    function updater(item) {
        selected = null;
        if (!nameToIdMap || !nameToIdMap[item])
            return null;
            
        selected = nameToIdMap[item];
        return item;
    }
    
    function getSelectedFoodId() {
        return selected;
    }
 
    $(function() {
        $("#search").typeahead({
            source: search,
            updater: updater
        });
    });
    
    return {
        getSelectedFoodId: getSelectedFoodId
    };
    
 });