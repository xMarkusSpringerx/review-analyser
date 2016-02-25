var r = require('rethinkdb');
var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

var app = express();

var mlearning = require('./lib/mlearning');

/* INIT */
var ai = mlearning();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.listen(1337, function () {
    console.log('Server listening on Port 1337!');
});


/* END INIT */

/* ROUTING */
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.post('/getrating', urlencodedParser, function (req, res) {
    var text = req.body.text;

    console.log(text);

    res.send(ai.analyze(text));
});

/* END ROUTING */

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
                typeof callback === 'function' && callback();
            });
        });
    }


    insertInAI(function () {
        console.log(ai.analyze("My personal favorite of the shorts shown for Experimental Week, but my professor looked at me like I was off my rocker when I said this was about American consumer culture; to me it couldn`t be about anything but consumer culture. The snow at the end (that`s another thing, he swears it`s ash) is a nice touch."));
        ai.standardWords();
    });

});