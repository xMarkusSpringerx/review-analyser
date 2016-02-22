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
    insertInAI(function(){
        console.log(ai.analyze("My personal favorite of the shorts shown for Experimental Week, but my professor looked at me like I was off my rocker when I said this was about American consumer culture; to me it couldn`t be about anything but consumer culture. The snow at the end (that`s another thing, he swears it`s ash) is a nice touch."));
    });


});