define(["jquery", "api"], function($, api) {
    
    "use strict";

    var food = null;
    
    function listFoods() {
        api.loadFoods().done(function(foods) {
            var $foodList = $("#foodList");
            var val = $foodList.val();
            $(foodList).empty();
            for (var i = 0; i < foods.length; i++) {
                var food = foods[i];
                var $option = $("<option>")
                    .text(food.name)
                    .val(food._id);
                $foodList.append($option);
            }
            $foodList.val(val);
        });
    }
    
    function viewFood() {
        var id = $("#foodList").val();
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
        var id = $("#foodList").val();
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
            listFoods();
            $("#editFood").modal("hide");
            food = null;
        });
    }
    
    function addFood() {
        adding = true;
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
            listFoods();
            $("#editFood").modal("hide");
            food = null;
        });
    }
    
    function saveFood() {
        if (food || food._id) {
            saveEditFood();
        } else {
            saveNewFood();
        }
    }
    
    $(function() {
        listFoods();
        $("#add").click(addFood);
        $("#viewFoodButton").click(viewFood);
        $("#editFoodButton").click(editFood);
        $("#addFoodButton").click(addFood);
        $("#editFoodSave").click(saveFood);
    });
});
