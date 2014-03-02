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
var geolib = require('geolib')

exports.post = function(req, res) {

    var message = req.body ? req.body.Body : null;

    if (!message || typeof message !== 'string') {

        res.statusCode = 200;
        res.send('Ok');
    }
    else {

        var handler;
        if (message.toUpperCase().indexOf('DESC-') !== -1) {

            handler = _processDescriptionRequest;
        }
        else {

            handler = _processSearchByAddress;
        }

        handler(message, function(error, message) {

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
}

function _processSearchByAddress(location, cb) {

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

                        var coord1 = {
                            latitude: filters.latitude,
                            longitude: filters.longitude
                        };

                        var coord2 = {
                            latitude: bath.latitude,
                            longitude: bath.longitude
                        };

                        var msg = 'Closest Restroom: ';
                            msg += bath.name + ', ';
                            msg += bath.street + ', ';
                            msg += bath.city + ', ';
                            msg += bath.state + '. ';
                            msg += 'Distance: ';
                            msg += Math.round(geolib.convertUnit('mi', geolib.getDistance(coord1, coord2)), 2) + ' mi.';
                        if (bath.comment) {
                            msg += ' Reply DESC-' + bath.id + ' for description.';
                        }
                        wcb(null, msg);
                    }
                });
            }
        }

    ], cb);
}

function _processDescriptionRequest(message, cb) {

    var bathroomId = message.split('DESC-')[1].split(/[ ,]+/)[0];

    if (!_.isFinite(bathroomId)) {

        cb(new Error('Invalid bathroom ID: '+ bathroomId));
        return;
    }

    var service = new bathroom.Service();

    var filters = {
        id: bathroomId
    };

    service.find(filters, null, function(error, results) {

        if (error) {
            cb(error, null);
        }
        else if (!Array.isArray(results) || !results.length) {
            cb(null, null);
        }
        else {
            var bath = results[0];
            var msg = bath.name + ': ';
                msg += bath.comment + ' ';
                msg += 'Access: ' + (bath.access ? true : false) + '. ';
                msg += 'Upvotes: ' + bath.upvote + '. ';
                msg += 'Downvotes: ' + bath.downvote + '.';

            cb(null, msg);
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