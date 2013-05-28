define(["jquery", "api"], function($, api) {

    var date;
    
    function prettyDate(d) {
        return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
    }

    function showDate() {
        date = new Date();
        $('#date').text(prettyDate(date));
    }
    
    function getFoodDiv(food, quantity) {
        var $div = $("<div>"),
            multiplier = quantity && quantity !== 1 ? " (x" + quantity + ")" : "",
            button;
        $div.append($("<strong>").text(food.name + multiplier + ":"));
        $div.append($("<span>").text("Calories: " + food.calories * quantity));
        $div.append($("<span>").text("Fat: " + food.fat * quantity));
        $div.append($("<span>").text("Carbs: " + food.carb * quantity));
        $div.append($("<span>").text("Protein: " + food.protein * quantity));
        if (food.name !== "Totals") {
            button = $('<a class="btn btn-danger" href="#"><i class="icon-trash icon-white"></i> Delete</a>')
                            .data('id', food._id)
                            .data('rev', food._rev);
                            //.click(deleteFood);
            $div.append(button);
        }
        return $div;
    }

    function sumFood(totals, food, quantity) {
        totals.calories += food.calories * quantity;
        totals.fat += food.fat * quantity;
        totals.carb += food.carb * quantity;
        totals.protein += food.protein * quantity;
    }

    function showLog() {
        var $foods = $("#foods");
        $foods.empty();

        api.loadLog().done(function(logs) {
            var totals = { name: "Totals", calories: 0, fat: 0, carb: 0, protein: 0 },
                i,
                food;
            for (i = 0; i < logs.length; i++) {
                log = logs[i].log;
                food = logs[i].food;
                sumFood(totals, food, log.quantity);
                $foods.append(getFoodDiv(food, log.quantity));
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