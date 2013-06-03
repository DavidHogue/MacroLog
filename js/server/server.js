"use strict";

var express = require("express");
var config = require("./config");
var api = require("./api");

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var log = function(req, res, next) {
    console.log(req.method + ": " + req.originalUrl);

    next();
}

app.configure(function() {
    app.use(log);
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
});

app.options("/*", function(req, res) {
    res.end();
});

app.get("/food/all", function(req, res) {
    api.loadFoods(function(results) {
        res.json(results);
    });
});

app.get("/food/search/:input", function(req, res) {
    api.searchFoods(req.params.input, function(results) {
        res.json(results);
    });
});

app.get("/food/id/:id", function(req, res) {
    api.getFood(req.params.id, function(results) {
        res.json(results);
    });
});

app.post("/food/save", function(req, res) {
    api.addFood(req.body, function(results) {
        res.json(results);
    });
});

app.get("/log/:date", function(req, res) {
    api.loadLog(req.params.date, function(results) {
        res.json(results);
    });
});

app.post("/log/save", function(req, res) {
    api.logFood(req.body, function(results) {
        res.json(results);
    });
});

app.del("/log/delete/:id/:rev", function(req, res) {
    api.deleteLog(req.params.id, req.params.rev, function(results) {
        res.json(results);
    });
});

app.get("/day/:date", function(req, res) {
    api.getDay(req.params.date, function(results) {
        res.json(results);
    });
});

app.post("/day/save", function(req, res) {
    api.saveDay(req.body, function(results) {
        res.json(results);
    });
});

app.get("/goals", function(req, res) {
    api.getGoals(function(results) {
        res.json(results);
    });
});

app.post("/goals/save", function(req, res) {
    api.saveGoals(req.body, function(results) {
        res.json(results);
    });
});


app.listen(config.port, config.ip);

console.log("server running at http://" + config.ip + ":" + config.port + "/");

