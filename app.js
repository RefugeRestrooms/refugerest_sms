/*
 server.js
 RESTful web API for Refuge Restrooms.
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var routes = require('./routes');

app.use(express.favicon());
app.use(express.bodyParser());
app.use(app.router);

routes.setup(app);

app.use(processError); // must be last

app.listen(port, function(err) {

    if (err) {
        console.log(err);
        process.exit(1);
    }
    else {
        console.log('Listening on port ' + port);
    }
});

function processError(err, req, res, next) {
    console.error(err.stack);
    res.send(500, "Ruh roh! We couldn't process your request. Sorry about that.");
}