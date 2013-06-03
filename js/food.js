define(["jquery", "api", "search", "lib/knockout"], function($, api, search, ko) {
    
    "use strict";

    var food = null;
    var blankFood = { 
            type: "food",
            name: "",
            calories: undefined,
            fat: undefined,
            saturatedFat: undefined,
            transFat: undefined,
            cholesterol: undefined,
            sodium: undefined,
            carb: undefined,
            fiber: undefined,
            sugars: undefined,
            protein: undefined
        };

    function setCurrentFood(newFood) {
        food = $.extend(blankFood, newFood); // Ensure it has all the right properties
    }
    
    function viewFood() {
        var id = search.getSelectedFoodId();
        if (!id)
            return;
        
        api.getFood(id).done(function(f) {
            setCurrentFood(f);
            ko.applyBindings(food);
            $("#showFood").modal("show");
        });
    }
    
    function editFood() {
        var id = search.getSelectedFoodId();
        if (!id)
            return;

        api.getFood(id).done(function(f) {
            setCurrentFood(f);
            ko.applyBindings(food);
            $("#editFood").modal("show");
        });
    }
    
    function saveEditFood() {
        // In theory knockoutjs should have set the food's properties by now.
        api.editFood(food).done(function() {
            $("#editFood").modal("hide");
            food = null;
        });
    }
    
    function addFood() {
        food = $.extend(blankFood, {});
        ko.applyBindings(food);
        $("#editFood").modal("show");
    }
    
    function saveNewFood() {
        // In theory knockoutjs should have set properties by now.
        api.addFood(food).done(function() {
            $("#editFood").modal("hide");
            food = null;
        });
    }
    
    function saveFood() {
        if (food && food._id) {
            saveEditFood();
        } else {
            saveNewFood();
        }
    }
    
    $(function() {
        $("#add").click(addFood);
        $("#viewFoodButton").click(viewFood);
        $("#editFoodButton").click(editFood);
        $("#addFoodButton").click(addFood);
        $("#editFoodSave").click(saveFood);
    });
});
