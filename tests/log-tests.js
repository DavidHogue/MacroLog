define(["log", "api"], function(log, api) {
    
    "use strict";
    
    module("log tests", {
        teardown: function() {
            api.resetStub();
            log.clearLog();
        }
    });
    
    test("logging food adds to total", function() {
        // arrange
        var food = { type: "food", name: "foo", calories: 100 };
        api.addFood(food);
        
        // act
        log.logFood(food._id, 1);
        
        // assert
        var totals = log.getTotals();
        equal(totals.calories, 100);
    });
    
    test("logging food with quantity 2 adds to total", function() {
        // arrange
        var food = { type: "food", name: "foo", calories: 100 };
        api.addFood(food);
        
        // act
        log.logFood(food._id, 2);
        
        // assert
        var totals = log.getTotals();
        equal(totals.calories, 200);
    });

    test("clearing log sets empty totals", function() {
        var totals = log.getTotals();
        equal(totals.calories, 0);
        equal(totals.fat, 0);
        equal(totals.carb, 0);
        equal(totals.protein, 0);
    });
    
});