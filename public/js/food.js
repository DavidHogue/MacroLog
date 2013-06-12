define(["jquery", "api", "search", "lib/knockout"], function($, api, search, ko) {
    
    "use strict";

    var food = null;
    var blankFood = { 
            type: "food",
            name: "",
            calories: "",
            fat: "",
            saturatedFat: "",
            transFat: "",
            cholesterol: "",
            sodium: "",
            carb: "",
            fiber: "",
            sugars: "",
            protein: ""
        };

    function setCurrentFood(newFood) {
        food = $.extend({}, blankFood, newFood); // Ensure it has all the right properties
    }
    
    function getCurrentFood() {
        return food;
    }
    
    function viewFood() {
        var id = search.getSelectedFoodId();
        if (!id)
            return;
        
        api.getFood(id).done(function(f) {
            setCurrentFood(f);
            ko.applyBindings(food, document.getElementById("showFood"));
            $("#showFood").modal("show");
        });
    }
    
    function editFood() {
        var id = search.getSelectedFoodId();
        if (!id)
            return;

        api.getFood(id).done(function(f) {
            setCurrentFood(f);
            ko.applyBindings(food, document.getElementById("editFood"));
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
        food = $.extend({}, blankFood);
            ko.applyBindings(food, document.getElementById("editFood"));
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
    
    return {
        setCurrentFood: setCurrentFood,
        getCurrentFood: getCurrentFood
    };
});
