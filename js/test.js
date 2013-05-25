(function() {

    var _database = "http://localhost:5984/macrolog";

    function addFood() {
        // Get an object from the form data.
        var food = {
            name: $("#name").val(),
            calories: parseFloat($("#calories").val()),
            fat: parseFloat($("#fat").val()),
            carb: parseFloat($("#carb").val()),
            protein: parseFloat($("#protein").val()),
            quantity: parseFloat($("#quantity").val()),
        };
        
        // Write to db.
        $.ajax(_database, {
            data: JSON.stringify(food),
            contentType: "application/json",
            type: "POST"
        }).done(function() {
            showFoods();
        });
        
        // Prevent normal button events.
        return false;
    }
    
    function loadFoods() {
        var deferred = new $.Deferred();
        
        $.ajax(_database + "/_design/foods/_view/all", {
            type: "GET"
        }).done(function(data) {
            var parsed = JSON.parse(data);
            var results = [];
            for (var i = 0; i < parsed.total_rows; i++) {
                var food = parsed.rows[i].value;
                var newFood = {
                    name: food.name,
                    calories: food.calories || 0,
                    fat: food.fat || 0,
                    carb: food.carb || 0,
                    protein: food.protein || 0,
                    quantity: food.quantity || 1
                };
                results.push(newFood);
            }
            deferred.resolve(results);
        });
        
        return deferred;
    }
    
    function getFoodDiv(food) {
        var $div = $("<div>");   
        var multiplier = food.quantity && food.quantity != 1 ? " (x" + food.quantity + ")" : "";
        $div.append($("<h4>").text(food.name + multiplier + ":"));
        $div.append($("<div>").text("Calories: " + food.calories));
        $div.append($("<div>").text("Fat: " + food.fat));
        $div.append($("<div>").text("Carbs: " + food.carb));
        $div.append($("<div>").text("Protein: " + food.protein));
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
            var totals = { name: "Totals", calories: 0, fat: 0, carb: 0, protein: 0 };
            for(var i in foods) {
                var food = foods[i];
                sumFood(totals, food);                
                $foods.append(getFoodDiv(food));
            }
            $foods.append(getFoodDiv(totals));
        });
    }

    $(function() {
        $("#add").click(addFood);
        showFoods();
    });
})();