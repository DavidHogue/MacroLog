requirejs.config({
    paths: {
        "jquery": "http://code.jquery.com/jquery-1.10.0.min"
    },
    shim: {
        "jquery": {
            exports: "jQuery"
        }
    }
});

define("jquery", function() {
    return window.jQuery;
});

require([
    "food", 
    "log"
]);
