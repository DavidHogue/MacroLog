define(["jquery", "api"], function($, api) {

    "use strict";
    
    var goals = { type: "goals" };

    function showGoals() {
        $("#goalCalories").text(goals.calories);
        $("#goalFat").text(goals.fat);
        $("#goalCarbs").text(goals.carbs);
        $("#goalProtein").text(goals.protein);
    }
    
    function loadGoals() {
        api.getGoals().done(function(g) {
            if (g)
                goals = g;
            showGoals();
        });
    }
    
    function editGoals() {
        $("#editGoalCalories").val(goals.calories);
        $("#editGoalFat").val(goals.fat);
        $("#editGoalCarbs").val(goals.carbs);
        $("#editGoalProtein").val(goals.protein);

        $("#editGoalsSave").click(function() {
            goals.calories = $("#editGoalCalories").val();
            goals.fat = $("#editGoalFat").val();
            goals.carbs = $("#editGoalCarbs").val();
            goals.protein = $("#editGoalProtein").val();
            api.saveGoals(goals).done(function() {
                showGoals();
                $("#editGoalsSave").unbind("click");
                $("#editGoals").modal("hide");
            });
        });
        
        $("#editGoals").modal("show");
    }
    
    $(function() {
        loadGoals();
        $("#editGoalsButton").click(editGoals);
    });
});