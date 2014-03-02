/*
 model/resources/datastore/index.js
 Database connection manager.
 */

var pg;
var client;

if (process.env.PG_NATIVE === 'true') {
    pg = require('pg').native;
}
else {
    pg = require('pg');
}

function query(sql, args, cb) { //cb(err, rows)

    if (process.env.DATABASE_URL) {

        if (!client) {

            var connProps = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

            client = new pg.Client({
                user: connProps[1],
                password: connProps[2],
                host: connProps[3],
                port: connProps[4],
                database: connProps[5],
                ssl: true
            });

            client.connect(function(error) {

                if (error) {
                    client = null;
                    cb(error, null);
                }
                else _run(sql, args, cb);
            });
        }
        else _run(sql, args, cb);
    }
    else cb(new Error('Invalid db connection properties'), null);
}

function _run(sql, args, cb) {

    if (!Array.isArray(args)) {
        args = [];
    }

    client.query(sql, args, function(error, result) {

        if (error) {
            cb(error, null);
        }
        else if (!result || !Array.isArray(result.rows)) {
            cb(null, []);
        }
        else cb(null, result.rows);
    });
}

exports.query = query;