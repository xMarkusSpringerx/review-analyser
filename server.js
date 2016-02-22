var r = require('rethinkdb');
var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();

var mlearning = require('./lib/mlearning');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(1337, function () {
    console.log('Server listening on Port 1337!');
});


r.connect({host: 'localhost', port: 28015}, function (err, conn) {
    // Can't connect to Server
    if (err) throw err;

    connection = conn;

    // Create Datebase for first init
    r.dbCreate('moviecrawler').run(connection, function (err) {
    });

    // Map db to connection
    connection.use('moviecrawler');

    r.tableList().run(connection, function (err, list) {
        if (err) throw err;
        checkTable(list, "movies");
        checkTable(list, "reviews");
    });

    function checkTable(list, tablename) {
        if (list.indexOf(tablename) == -1) {
            r.tableCreate(tablename).run(conn, function (err, result) {
                if (err) throw err;
                console.log('created table ', tablename);
            });
        } else {
            // For testing:
            // Delete all Entries on startup
            //r.table(tablename).delete().run(conn, function () {
            //    console.log('deleted all entries in ', tablename);
            //});
        }
    }

    function insertInAI(callback) {
        r.table('reviews').run(connection, function (err, cursor) {
            if (err) throw err;
            cursor.toArray(function (err, result) {
                if (err) throw err;
                var i = 1;
                result.forEach(function (review) {
                    ai.learn(review.text, review.rating);
                    console.log(i);
                    i++;
                });
                callback();
            });

        });
    }


    var ai = mlearning();
    insertInAI();

});