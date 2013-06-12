require(['jquery'], function($) {

    "use strict";

    var database = "http://localhost:5984/macrolog",
        date;

    function prettyDate(d) {
        return d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
    }

    function loadFoods() {
        var deferred = new $.Deferred();

        $.ajax(database + "/_design/foods/_view/date", {
            type: "GET",
            data: prettyDate(date)
        }).done(function(data) {
            var parsed = JSON.parse(data),
                results = [],
                i,
                food;
            for (i = 0; i < parsed.total_rows; i += 1) {
                food = parsed.rows[i].value;
                food.calories = food.calories || 0;
                food.fat = food.fat || 0;
                food.carb = food.carb || 0;
                food.protein = food.protein || 0;
                food.quantity = food.quantity || 1;
                results.push(food);
            }
            deferred.resolve(results);
        });

        return deferred;
    }

    function deleteFood() {
        var $button = $(this),
            rev = $button.data('rev'),
            id = $button.data('id');
        $.ajax(database + "/" + id + "?rev=" + encodeURIComponent(rev), {
            type: "DELETE"
        }).done(function() {
            $button.parent().remove();
        });
    }

    function getFoodDiv(food) {
        var $div = $("<div>"),
            multiplier = food.quantity && food.quantity !== 1 ? " (x" + food.quantity + ")" : "",
            button;
        $div.append($("<h4>").text(food.name + multiplier + ":"));
        $div.append($("<div>").text("Calories: " + food.calories));
        $div.append($("<div>").text("Fat: " + food.fat));
        $div.append($("<div>").text("Carbs: " + food.carb));
        $div.append($("<div>").text("Protein: " + food.protein));
        if (food.name !== "Totals") {
            button = $('<a class="btn btn-danger" href="#"><i class="icon-trash icon-white"></i> Delete</a>')
                            .data('id', food._id)
                            .data('rev', food._rev)
                            .click(deleteFood);
            $div.append(button);
        }
        return $div;
    }

    function sumFood(totals, food) {
        totals.calories += food.calories * food.quantity;
        totals.fat += food.fat * food.quantity;
        totals.carb += food.carb * food.quantity;
        totals.protein += food.protein * food.quantity;
    }

    function showFoods() {
        var $foods = $("#foods");
        $foods.empty();

        loadFoods().done(function(foods) {
            var totals = { name: "Totals", calories: 0, fat: 0, carb: 0, protein: 0 },
                i,
                food;
            for (i = 0; i < foods.length; i += 1) {
                food = foods[i];
                sumFood(totals, food);
                $foods.append(getFoodDiv(food));
            }
            $foods.append(getFoodDiv(totals));
        });
    }

    function addFood() {
        // Get an object from the form data.
        var food = {
            name: $("#name").val(),
            calories: parseFloat($("#calories").val()),
            fat: parseFloat($("#fat").val()),
            carb: parseFloat($("#carb").val()),
            protein: parseFloat($("#protein").val()),
            quantity: parseFloat($("#quantity").val()),
            date: prettyDate(date)
        };

        // Write to db.
        $.ajax(database, {
            data: JSON.stringify(food),
            contentType: "application/json",
            type: "POST"
        }).done(function() {
            showFoods();
        });

        // Prevent normal button events.
        return false;
    }

    function showDate() {
        date = new Date();
        $('#date').text(prettyDate(date));
    }

    $(function() {
        showDate();
        showFoods();

        $("#add").click(addFood);
    });
});
