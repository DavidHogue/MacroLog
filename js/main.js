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

require(["food", "log"]);