 define(["api"], function(api) {
 
    var nameToIdMap
 
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
                nameToIdMap[food.name] = food.id;
                
                // Add the name to the list for the drop down.
                foods.push(food.name);
            }
            
            // Show the list
            process(foods);
        });
    }
    
    function getSelectedFood() {
        if (!nameToIdMap)
            return null;
        
        var search = $("#search").val();
        if (!nameToIdMap[search])
            return null;
            
        return {
            id: nameToIdMap[search],
            name: search
        };
    }
 
    $(function() {
        $("#search").typeahead({
            source: search
        });
    });
    
    return {
        getSelectedFood: getSelectedFood
    };
    
 });