var _ = require('underscore');
var util = require('util');
var path = require('path');
var datastore = require(path.resolve(__dirname, './datastore'));
var schema = require(path.resolve(__dirname, './schemas/bathroom'));

function Bathroom(data) {

    if (!this instanceof Bathroom) {
        return new Bathroom(data);
    }

    Object.defineProperties(this, schema);
    Object.seal(this);

    if (data) {
        _.extend(this, data);
    }
}

function Service() {}

Service.prototype.sync = function(obj, cb) { //cb(err);

    if (!obj instanceof Bathroom) {

        cb(new Error('Invalid Bathroom object; sync failed'));
    }
    else {

        var sql = 'select * from public.upsert_bathroom($1);';
        var args = _.values(obj);

        datastore.query(sql, args, function(err, rows) {

            if (err) {

                cb(err);
            }
            else if (!Array.isArray(rows) || !rows.length) {

                cb(new Error('Unknown sync error'));
            }
            else {

                _.extend(obj, rows[0]); // Update original obj w/ new values
                cb(null);
            }
        });
    }
};

Service.prototype.find = function(filters, options, cb) {

    filters = filters || {};
    options = options || {};

    var sql = 'select * from public.search_bathrooms($1, $2, $3, $4, $5);';
    var args = [
        filters.id,
        filters.latitude,
        filters.longitude,
        filters.keywords,
        options.limit
    ];

    datastore.query(sql, args, function(err, rows) {

        var results;
        var i;

        if (err) {

            cb(err, null);
        }
        else {

            results = [];
            i = rows.length;

            while (i--) {
                results.push(new Bathroom(rows[i]));
            }

            cb(null, results);
        }
    });
};

exports.Bathroom = Bathroom;
exports.Service = Service;