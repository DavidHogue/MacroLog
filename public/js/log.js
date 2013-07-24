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
        var food = search.getSelectedFood(),
            quantity = parseFloat($("#quantity").val()) || 1,
            units = $("#logUnitSelector .selection").text();

        if (!food)
            return;
        
        if (units == "servings" || units == "serving")
            quantity = quantity;
        else if (units == food.servingSizeUnits)
            quantity = quantity / food.servingSize;
        else if (units == food.servingSizeAltUnits)
            quantity = quantity / food.servingSizeAlt;
        else
            return;
        
        logFood(food._id, quantity)
        
        // Prevent normal button events.
        return false;
    }
    
    function foodSelected(food) {
        var units = $("#logUnitSelector");
        var ul = units.find("ul");
        ul.empty();
        
        var li = $("<li><a href=\"#\"></a></li>");
        li.find("a").text("servings");
        ul.append(li);
        
        if (food.servingSizeUnits) {
            var li = $("<li><a href=\"#\"></a></li>");
            li.find("a").text(food.servingSizeUnits);
            ul.append(li);
        }
        
        if (food.servingSizeAltUnits) {
            var li = $("<li><a href=\"#\"></a></li>");
            li.find("a").text(food.servingSizeAltUnits);
            ul.append(li);
        }
        
        ul.find("li a").click(function() {
            units.find(".selection").text($(this).text());
        });
    }

    showLog();
    $("#log").click(logClicked);
    search.onFoodSelected(foodSelected);
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