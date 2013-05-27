define(["jquery", "config"], function($, config) {
    
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
    
    function listFoods() {
        loadFoods().done(function(foods) {
            var $foodList = $("#foodList");
            for (var i = 0; i < foods.length; i++) {
                var food = foods[i];
                var $option = $("<option>")
                    .text(food.name)
                    .val(food._id);
                $foodList.append($option);
            }
        });
    }
    
    function addFood() {
        // Get an object from the form data.
        var food = {
            type: "food",
            name: $("#name").val(),
            calories: parseFloat($("#calories").val()) || 0,
            fat: parseFloat($("#fat").val()) || 0,
            carb: parseFloat($("#carb").val()) || 0,
            protein: parseFloat($("#protein").val()) || 0
        };

        // Write to db.
        $.ajax(config.database, {
            data: JSON.stringify(food),
            contentType: "application/json",
            type: "POST"
        }).done(listFoods);

        // Prevent normal button events.
        return false;
    }
    
    $(function() {
        listFoods();
        $("#add").click(addFood);
    });
});
