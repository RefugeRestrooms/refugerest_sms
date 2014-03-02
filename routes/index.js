/*
 routes/index.js
 Web API request router.
 */

var twilio = require('twilio');
var searchSMS = require(__dirname + '/search/sms');

exports.setup = function(app) {

    app.post('/messages/sms', twilio.webhook({validate: false, includeHelpers:true}), searchSMS.post);
};