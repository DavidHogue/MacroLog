"use strict";

var express = require("express");
var config = require("./config");
var api = require("./api");

var app = express();

app.set("title", "My Site");

app.get("/api/loadFoods", function(req, res) {
    api.loadFoods(function(results) {
        res.end(JSON.stringify(results));
    });
});

app.get("/api/search/:input", function(req, res) {
    api.searchFoods(req.params.input, function(results) {
        res.end(JSON.stringify(results));
    });
});

app.get("/api/food/:id", function(req, res) {
    api.getFood(req.params.id, function(results) {
        res.end(JSON.stringify(results));
    });
});

app.listen(config.port, config.ip);

console.log("server running at http://" + config.ip + ":" + config.port + "/");