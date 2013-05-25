(function() {

    var _database = "http://localhost:5984/macrolog/";

    function addFood() {
        // Get an object from the form data.
        var food = {
            name: $("#name").val(),
            calories: $("#calories").val(),
            fat: $("#fat").val(),
            carb: $("#carb").val(),
            protein: $("#protein").val()
        };
        
        // Write to db.
        $.ajax(_database, {
            data: JSON.stringify(food),
            contentType: "application/json",
            type: "POST"
        }, function() {
            console.log("success");
        });
        
        // Prevent normal button events.
        return false;
    }
    
    function loadFoods() {
        $.ajax
    }

    $(function() {
        $("#add").click(addFood);
        loadFoods();
    });
})();