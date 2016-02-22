var c = require("./connectors");
var connectors = c();


var split = function (text) {
    var reg = /[^\w\s]/g;
    var text = text.replace(reg, ' ');
    return text.split(/\s+/);
};


var doAllWordOperations = function (text) {
    var res_ary = [];

    var tokens = split(text);

    tokens.forEach(function (word) {
        //console.log(word);
        if (connectors.all.indexOf(word) == -1) {
            word.toLowerCase();
            res_ary.push(word);
        }
    });

    return res_ary;
};

function MLearning() {
    // true and false gets inserted on token hash values in Object
    this.voc = {};
    this.vocSize = 0;

    this.total = 0;

    this.docsInCat = {};

    this.wordsTotalInCat = {};

    this.wordFreqCount = {};

    this.allCategories = {};

    // Checks how often a token is in Table
    this.freqTable = function (words) {
        var f = {};
        words.forEach(function (token) {
            if (!f[token]) {
                f[token] = 1;
            }
            else {
                f[token]++
            }
        });
        return f
    };


    this.analyze = function (text) {
        var obj = this;
        var maxProb = -Infinity;
        var result;

        var words = doAllWordOperations(text);

        var freqTable = obj.freqTable(words);

        Object.keys(obj.allCategories).forEach(function (category) {
            var cp = obj.docsInCat[category] / obj.total;

            var lp = Math.log(cp);

            // P( word | category ) for each word in the text
            Object.keys(freqTable).forEach(function (token) {
                var howOftenInText = freqTable[token];
                var tokenProb = obj.tokenProb(token, category);
                // log of the P( word | category ) for this word
                lp += howOftenInText * Math.log(tokenProb);
            });

            if (lp > maxProb) {
                maxProb = lp;
                result = category;
            }
        });

        return result;
    };

    this.learn = function (text, category) {
        var obj = this;

        var tokens = doAllWordOperations(text);

        // Init Category
        if (!this.allCategories[category]) {
            this.wordsTotalInCat[category] = 0;
            this.wordFreqCount[category] = {};
            this.allCategories[category] = true;
            this.docsInCat[category] = 0;
        }

        obj.docsInCat[category]++;
        obj.total++;

        var freqTable = obj.freqTable(tokens);

        Object.keys(freqTable).forEach(function (token) {
            if (!obj.voc[token]) {
                obj.voc[token] = true;
                obj.vocSize++
            }

            var howOftenInText = freqTable[token];

            if (!obj.wordFreqCount[category][token]) {
                obj.wordFreqCount[category][token] = howOftenInText;
            }
            else {
                obj.wordFreqCount[category][token] += howOftenInText;
            }
            obj.wordsTotalInCat[category] += howOftenInText;
        });
        return obj;
    };

    this.tokenProb = function (token, category) {
        var wordFreqCount;
        // if not recognized
        if (typeof this.wordFreqCount[category][token] === 'undefined') {
            wordFreqCount = 0;
        } else {
            wordFreqCount = this.wordFreqCount[category][token];
        }

        var allWords = this.wordsTotalInCat[category];
        return ( wordFreqCount + 1 ) / ( allWords + this.vocSize );

    };
}


module.exports = function () {
    return new MLearning()
};

