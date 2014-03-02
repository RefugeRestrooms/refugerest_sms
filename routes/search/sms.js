/*
 routes/search/sms.js
 Request handler for bathroom search via SMS, powered by Twilio.
 */

var _ = require('underscore');
var async = require('async');
var path = require('path');
var bathroom = require(path.resolve(__dirname, '../../model')).bathroom;
var twilio = require('twilio');
var geocoder = require('geocoder');

exports.post = function(req, res) {

    var location = req.body ? req.body.Body : null;

    if (!location) {
        res.statusCode = 200;
        res.send('Ok');
        return;
    }

    async.waterfall([

        // Get location coordinates
        function(wcb) {

            _getCoordinatesForLocation(location, wcb);
        },

        // Search for closest restroom
        function(coordinates, wcb) {

            if (!coordinates) {

                wcb(null, null);
            }
            else {

                var service = new bathroom.Service();

                var filters = {
                    latitude: coordinates.lat,
                    longitude: coordinates.lng
                };

                var options = {
                    limit: 1
                };

                service.find(filters, options, function(error, results) {

                    if (error) {
                        wcb(error, null);
                    }
                    else if (!Array.isArray(results) || !results.length) {
                        wcb(null, null);
                    }
                    else {
                        var bath = results[0];
                        var msg = 'Closest Restroom: ';
                            msg += bath.name + ', ';
                            msg += bath.street + ', ';
                            msg += bath.city + ', ';
                            msg += bath.state;
                        wcb(null, msg);
                    }
                });
            }
        }

    ], function(error, message) {

        // Respond to request
        var reply;

        if (error) {
            console.log(error);
            res.statusCode = 500;
            res.send('Ok');
        }
        else if (!message) {
            res.statusCode = 200;
            res.send('Ok');
        }
        else {
            reply = new twilio.TwimlResponse();
            reply.message(message);
            res.send(reply);
        }
    });
}

function _getCoordinatesForLocation(locationStr, cb) { //cb(err, coordinates)

    geocoder.geocode(locationStr, function(err, data) {

        var coordinates,
            results = data ? data.results[0] : null;

        if (results && results.geometry &&
        results.geometry.location &&
        _.isFinite(results.geometry.location.lat) &&
        _.isFinite(results.geometry.location.lng)) {

            coordinates =  results.geometry.location;
        }

        cb(err, coordinates);
    });
}