define(["jquery", "config"], function($, config) {

    var date;
    
    function prettyDate(d) {
        return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
    }

    function showDate() {
        date = new Date();
        $('#date').text(prettyDate(date));
    }
    
    
    function loadLog() {
        var deferred = new $.Deferred();

        $.ajax(config.database + "/_design/log/_view/date_full", {
            type: "GET",
            data: {
                //key: prettyDate(date)
                include_docs: true
            }
        }).done(function(data) {
            var parsed = JSON.parse(data),
                results = [],
                i,
                log,
                food;
            for (i = 0; i < parsed.total_rows; i += 1) {
                log = parsed.rows[i].value.log;
                food = parsed.rows[i].doc;
                results.push({ log: log, food: food });
            }
            
            deferred.resolve(results);
        });

        return deferred;
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

        loadLog().done(function(logs) {
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
        $.ajax(config.database, {
            data: JSON.stringify(log),
            contentType: "application/json",
            type: "POST"
        }).done(function() {
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