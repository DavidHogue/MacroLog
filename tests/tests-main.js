requirejs.config({
    baseUrl: "../public/js",
    paths: {
        jquery: "http://code.jquery.com/jquery-1.10.0.min",
        propertyParser : "lib/propertyParser",
        bootstrap: "lib/bootstrap.min",
        tests: "../../tests",
        api: "../../tests/stub-api"
    },
    shim: {
        jquery: {
            exports: "jQuery"
        },
        bootstrap: {
            deps: ["jquery"],
            exports: "$.fn.popover"
        }
    }
});

require([
    "tests/food-tests",
    "tests/log-tests"
], function() {
    start();
});
