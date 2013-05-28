define(["jquery", "api"], function($, api) {

    var date;
    
    function prettyDate(d) {
        return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
    }

    function showDate() {
        date = new Date();
        $('#date').text(prettyDate(date));
    }
    
    function deleteFood() {
        var $button = $(this);
        var id = $button.data('id');
        var rev = $button.data('rev');
        api.deleteLog(id, rev).done(function() {
            $button.parent().remove();
        });
    }
    
    function getFoodDiv(food, log) {
        if (!log) {
            log = { quantity: 1 };
        }
        var $div = $("<div>"),
            multiplier = log.quantity && log.quantity !== 1 ? " (x" + log.quantity + ")" : "",
            button;
        if (food) {
            $div.append($("<strong>").text(food.name + multiplier + ":"));
            $div.append($("<span>").text("Calories: " + food.calories * log.quantity));
            $div.append($("<span>").text("Fat: " + food.fat * log.quantity));
            $div.append($("<span>").text("Carbs: " + food.carb * log.quantity));
            $div.append($("<span>").text("Protein: " + food.protein * log.quantity));
        }
        if (log._id) {
            button = $('<a class="btn btn-danger" href="#"><i class="icon-trash icon-white"></i> Delete</a>')
                            .data('id', log._id)
                            .data('rev', log._rev)
                            .click(deleteFood);
            $div.append(button);
        }
        return $div;
    }

    function sumFood(totals, food, quantity) {
        if (!food || !quantity)
            return;

        totals.calories += food.calories * quantity;
        totals.fat += food.fat * quantity;
        totals.carb += food.carb * quantity;
        totals.protein += food.protein * quantity;
    }

    function showLog() {
        var $foods = $("#foods");
        $foods.empty();

        api.loadLog(prettyDate(date)).done(function(logs) {
            var totals = { name: "Totals", calories: 0, fat: 0, carb: 0, protein: 0 },
                i,
                food;
            for (i = 0; i < logs.length; i++) {
                log = logs[i].log;
                food = logs[i].food;
                sumFood(totals, food, log.quantity);
                $foods.append(getFoodDiv(food, log));
            }
            $foods.append(getFoodDiv(totals));
        });
    }

    function logFood() {
        // Get an object from the form data.
        var log = {
            type: "log",
            food_id: $("#foodList").val(),
            quantity: parseFloat($("#quantity").val()) || 1,
            date: prettyDate(date)
        };

        // Write to db.
        api.logFood(log).done(function() {
            showLog();
        });

        // Prevent normal button events.
        return false;
    }

    $(function() {
        showDate();
        showLog();

        $("#log").click(logFood);
    });

});