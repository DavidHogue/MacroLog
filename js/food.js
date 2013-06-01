define(["jquery", "api", "search", "lib/knockout"], function($, api, search, ko) {
    
    "use strict";

    var food = null;
    
    function viewFood() {
        var id = search.getSelectedFoodId();
        if (!id)
            return;
        
        api.getFood(id).done(function(f) {
            food = f;
            $("#showFoodName").text(food.name);
            $("#showFoodCalories").text(food.calories);
            $("#showFoodFat").text(food.fat);
            $("#showFoodSaturatedFat").text(food.saturatedFat);
            $("#showFoodCarb").text(food.carb);
            $("#showFoodProtein").text(food.protein);
            $("#showFood").modal("show");
        });
    } 
    
    function editFood() {
        var id = search.getSelectedFoodId();
        if (!id)
            return;

        api.getFood(id).done(function(f) {
            food = f;
            $("#editFoodName").val(food.name);
            $("#editFoodCalories").val(food.calories);
            $("#editFoodFat").val(food.fat);
            $("#editFoodSaturatedFat").val(food.saturatedFat);
            $("#editFoodCarb").val(food.carb);
            $("#editFoodProtein").val(food.protein);
            $("#editFood").modal("show");
        });
    }
    
    function saveEditFood() {        
        food.name = $("#editFoodName").val();
        food.calories = $("#editFoodCalories").val();
        food.fat = $("#editFoodFat").val();
        food.saturatedFat = $("#editFoodSaturatedFat").val();
        food.carb = $("#editFoodCarb").val();
        food.protein = $("#editFoodProtein").val();
        api.editFood(food).done(function() {
            $("#editFood").modal("hide");
            food = null;
        });
    }
    
    function addFood() {
        $("#editFoodName").val("");
        $("#editFoodCalories").val(0);
        $("#editFoodFat").val(0);
        $("#editFoodSaturatedFat").val();
        $("#editFoodCarb").val(0);
        $("#editFoodProtein").val(0);            
        $("#editFood").modal("show");
    }
    
    function saveNewFood() {
        food = { 
            type: "food",
            name: $("#editFoodName").val(),
            calories: parseFloat($("#editFoodCalories").val()) || 0,
            fat: parseFloat($("#editFoodFat").val()) || 0,
            saturatedFat: parseFloat($("#editFoodSaturatedFat").val()),
            carb: parseFloat($("#editFoodCarb").val()) || 0,
            protein: parseFloat($("#editFoodProtein").val()) || 0
        };
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
    
    var appViewModel = {
        firstName: "Bert",
        lastName: "Bertington",
        save: function(model) {
            console.log(JSON.stringify(model));
        }
    };
    
    $(function() {
        $("#add").click(addFood);
        $("#viewFoodButton").click(viewFood);
        $("#editFoodButton").click(editFood);
        $("#addFoodButton").click(addFood);
        $("#editFoodSave").click(saveFood);
        
        ko.applyBindings(appViewModel);
    });
});
