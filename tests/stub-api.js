define(["jquery"], function($) {

    "use strict";

    // Stub API implementation
    var foods = {},
        nextId = 1,
        log = [];

    return {

        stub: true,
        
        resetStub: function() {
            foods = {};
            nextId = 1;
            log = [];
        },

        getFood: function(id) {
            return foods[id];
        },

        addFood: function(food) {
            if (!food._id)
                food._id = nextId++;
            foods[food._id] = food;
        },

        loadLog: function(date) {
            return $.Deferred().resolve(log);
        },

        logFood: function(l) {
            log.push({
                log: l,
                food: this.getFood(l.food_id)
            });
            return $.Deferred().resolve();
        }

    };
});
