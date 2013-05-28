define(["jquery", "api"], function($, api) {
    
    "use strict";

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
        api.getFood(id).done(function(food) {
            $("#showFoodName").text(food.name);
            $("#showFoodCalories").text(food.calories);
            $("#showFoodFat").text(food.fat);
            $("#showFoodCarb").text(food.carb);
            $("#showFoodProtein").text(food.protein);
            $("#showFood").modal();
        });
    } 
    
    function editFood() {
        var id = $("#foodList").val();
        api.getFood(id).done(function(food) {
            $("#editFoodName").val(food.name);
            $("#editFoodCalories").val(food.calories);
            $("#editFoodFat").val(food.fat);
            $("#editFoodCarb").val(food.carb);
            $("#editFoodProtein").val(food.protein);
            
            $("#editFoodSave").click(function() {
                food.name = $("#editFoodName").val();
                food.calories = $("#editFoodCalories").val();
                food.fat = $("#editFoodFat").val();
                food.carb = $("#editFoodCarb").val();
                food.protein = $("#editFoodProtein").val();
                api.editFood(food).done(function() {
                    listFoods();
                    $("#editFoodSave").unbind("click");
                    $("#editFood").modal('hide');
                });
            });
            
            $("#editFood").modal('show');
        });
    }
    
    function addFood() {
        $("#editFoodName").val("");
        $("#editFoodCalories").val(0);
        $("#editFoodFat").val(0);
        $("#editFoodCarb").val(0);
        $("#editFoodProtein").val(0);
            
        $("#editFoodSave").click(function() {
            var food = { 
                type: "food",
                name: $("#editFoodName").val(),
                calories: parseFloat($("#editFoodCalories").val()) || 0,
                fat: parseFloat($("#editFoodFat").val()) || 0,
                carb: parseFloat($("#editFoodCarb").val()) || 0,
                protein: parseFloat($("#editFoodProtein").val()) || 0
            };
            api.addFood(food).done(function() {
                listFoods();
                $("#editFoodSave").unbind("click");
                $("#editFood").modal('hide');
            });
        });
            
        $("#editFood").modal('show');
    }
    
    $(function() {
        listFoods();
        $("#add").click(addFood);
        $("#viewFoodButton").click(viewFood);
        $("#editFoodButton").click(editFood);
        $("#addFoodButton").click(addFood);
    });
});
