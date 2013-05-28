define(["jquery", "api", "date"], function($, api, date) {

    function deleteFood(e) {
        e.preventDefault();

        var $button = $(this);
        var id = $button.data('id');
        var rev = $button.data('rev');
        api.deleteLog(id, rev).done(function() {
            $button.parents(".logRow").remove();
        });
    }

    function sumFood(totals, food, quantity) {
        if (!food || !quantity)
            return;

        totals.calories += food.calories * quantity;
        totals.fat += food.fat * quantity;
        totals.carb += food.carb * quantity;
        totals.protein += food.protein * quantity;
    }
    
    function addLogRow(food, log) {
        var $row = $(".logTemplate")
            .clone()
            .css("display", "")
            .removeClass("logTemplate")
            .addClass("logRow");
            
        if (!food) {
            food = { name: "-", calories: "-", fat: "-", carb: "-", protein: "-" };
        }
        
        $row.find(".name").text(food.name);
        $row.find(".calories").text(food.calories);
        $row.find(".fat").text(food.fat);
        $row.find(".carb").text(food.carb);
        $row.find(".protein").text(food.protein);
        
        if (log) {
            $row.find(".buttons .btn")
                .data('id', log._id)
                .data('rev', log._rev)
                .click(deleteFood);
        } else {
            $row.find(".buttons .btn").remove();
            $row.addClass("text-info");
        }
        
        $("#logTable").append($row);
    }

    function showLog() {
        $(".logRow").remove();

        api.loadLog(date.prettyDate()).done(function(logs) {
            var totals = { name: "Totals", calories: 0, fat: 0, carb: 0, protein: 0 },
                i,
                food;
            for (i = 0; i < logs.length; i++) {
                log = logs[i].log;
                food = logs[i].food;
                sumFood(totals, food, log.quantity);
                addLogRow(food, log);
            }
            addLogRow(totals);
        });
    }

    function logFood() {
        // Get an object from the form data.
        var log = {
            type: "log",
            food_id: $("#foodList").val(),
            quantity: parseFloat($("#quantity").val()) || 1,
            date: date.prettyDate()
        };

        // Write to db.
        api.logFood(log).done(function() {
            showLog();
        });

        // Prevent normal button events.
        return false;
    }

    $(function() {
        showLog();

        $("#log").click(logFood);
        date.dateChanged(showLog);
    });

});