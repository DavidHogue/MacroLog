define(["food"], function(food) {
    
    "use strict";
    
    module("food tests");
    
    test("setCurrentFood supplies missing properties", function() {
        food.setCurrentFood({});
        var current = food.getCurrentFood();
        equal(current.type, "food");
        equal(current.name, "");
        equal(current.calories, "");
        equal(current.fat, "");
        equal(current.saturatedFat, "");
        equal(current.transFat, "");
        equal(current.cholesterol, "");
        equal(current.sodium, "");
        equal(current.carb, "");
        equal(current.fiber, "");
        equal(current.sugars, "");
        equal(current.protein, "");
    });
    
    test("setCurrentFood blanks out fields from previous edit", function() {
        food.setCurrentFood({});
        var current = food.getCurrentFood();
        current.name = "foo";
        
        food.setCurrentFood({});
        current = food.getCurrentFood();
        equal(current.name, "");
    });
});