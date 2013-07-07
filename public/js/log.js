define(["jquery", "api", "date", "search", "lib/knockout"], function($, api, date, search, ko) {
    "use strict";
    
    var totals,
        logChangedCallback,
        view = {
            totals: ko.observable(),
            logs: ko.observableArray()
        };

    function logChanged(callback) {
        logChangedCallback = callback;
    }
    
    function ViewFood(log, food) {
        var log = log;
        this.rev = log._rev,
        this.name = food.name,
        this.quantity = log.quantity == 1 ? "" : "x" + log.quantity,
        this.calories = Math.round(food.calories * log.quantity),
        this.fat = Math.round(food.fat * log.quantity),
        this.carb = Math.round(food.carb * log.quantity),
        this.protein = Math.round(food.protein * log.quantity)

        this.deleteLog = function() {
            var removing = this;
            api.deleteLog(log._id, log._rev).done(function() {
                view.logs.remove(removing);
                triggerLogChanged();
            });
        }
    }
    
    function triggerLogChanged() {
        if (typeof logChangedCallback === "function")
            logChangedCallback();
    }
    
    function addToTotal(food, quantity) {
        if (!food || !quantity)
            return;

        totals.calories += food.calories * quantity;
        totals.fat += food.fat * quantity;
        totals.carb += food.carb * quantity;
        totals.protein += food.protein * quantity;
    }
    
    function getTotals() {
        return totals;
    }
    
    function clearLog() {
        totals = { name: "Totals", calories: 0, fat: 0, carb: 0, protein: 0 };
        view.totals(totals);
        view.logs.removeAll();
    }

    function showLog() {
        clearLog();

        api.loadLog(date.prettyDate()).done(function(logs) {
            var i,
                food;

            view.logs.removeAll();
            for (i = 0; i < logs.length; i++) {
                var log = logs[i].log;
                var food = logs[i].food;
                if (log && food) {
                    addToTotal(food, log.quantity);
                    view.logs.push(new ViewFood(log, food));
                }
            }
            view.totals(totals);
            triggerLogChanged();
        });
    }

    function logFood(id, quantity) {
        // Get an object to save.
        var log = {
            type: "log",
            food_id: id,
            quantity: quantity,
            date: date.prettyDate()
        };

        // Write to db.
        api.logFood(log).done(function() {
        
            // Update UI.
            showLog();
            triggerLogChanged();
        });
    }
    
    function logClicked() {
        var id = search.getSelectedFoodId(),
            quantity = parseFloat($("#quantity").val()) || 1;
        if (!id)
            return;
            
        logFood(id, quantity)
        
        // Prevent normal button events.
        return false;
    }

    showLog();
    $("#log").click(logClicked);
    date.dateChanged(showLog);
    ko.applyBindings(view, document.getElementById("debugView"));
    ko.applyBindings(view, document.getElementById("logTable"));

    return {
        getTotals: getTotals,
        logChanged: logChanged,
        logFood: logFood,
        clearLog: clearLog
    }
});