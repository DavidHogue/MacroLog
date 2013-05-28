define(["jquery", "api"], function($, api) {
    
    "use strict";

    function listFoods() {
        api.loadFoods().done(function(foods) {
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
    
    function viewFood() {
        var id = $("#foodList").val();
        api.getFood(id).done(function(food) {
            var $dialog = $("<div>");
            $dialog.css({ 
                position: "absolute",
                top: "150px",
                margin: "0 auto",
                border: "1px solid red",
                backgroundColor: "white"
            });
            $dialog.append($("<div>").text("Name: " + food.name));
            $dialog.append($("<div>").text("Calories: " + food.calories));
            $dialog.append($("<div>").text("Fat: " + food.fat));
            $dialog.append($("<div>").text("Carbs: " + food.carb));
            $dialog.append($("<div>").text("Protein: " + food.protein));
            $dialog.append($("<button>").text("Close").click(function() {
                $dialog.remove();
            }));
            
            $("body").append($dialog);
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
        
        api.addFood(food).done(listFoods);
    }
    
    $(function() {
        listFoods();
        $("#add").click(addFood);
        $("#viewFood").click(viewFood);
    });
});
