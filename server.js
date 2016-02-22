var r = require('rethinkdb');
var request = require('request');
var cheerio = require('cheerio');


var mlearning = require('./lib/mlearning');

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
        checkTable(list, "comments");
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
            r.table(tablename).delete().run(conn, function () {
                console.log('deleted all entries in ', tablename);
            });
        }
    }

    var ai = mlearning();

    ai.learn('text', 'rating');
    ai.learn('text', 'rating');
    ai.learn('text', 'rating');

    console.log(ai.analyze('text'));

});