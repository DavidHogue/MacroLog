requirejs.config({
    paths: {
        jquery: "http://code.jquery.com/jquery-1.10.0.min",
        async: "lib/async",
        goog: "lib/goog",
        propertyParser : "lib/propertyParser",
    },
    shim: {
        jquery: {
            exports: "jQuery"
        },
        bootstrap: {
            deps: ["jquery"]
        }
    }
});

define("jquery", function() {
    return window.jQuery;
});

define("bootstrap", function() {
    // Doesn't export anything, already on the page.
});

require([
    "food", 
    "log",
    "chart",
    "goals",
    "search"
]);
