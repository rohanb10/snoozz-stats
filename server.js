var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var db, C = 'clicks', T = 'times', app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.text({limit: '1kb'}));

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database.db('stats');
  console.log('Database connection ready');
  var server = app.listen(process.env.PORT || 8080, function () {
    console.log('App now running on port', server.address().port);
  });
});

function reject(res, msg) {
  console.log('ERROR: ' + msg);
  res.status(204).json({why: msg});
}

app.get('/clicks', cors({methods: ['GET']}), function(req, res) {
  if (!req || !req.headers || !req.headers.origin || !['https://snoozz.me', 'http://127.0.0.1:9000'].includes(req.headers.origin)) {
    return reject(res, 'Who are you?')
  }
  db.collection(C).find({}, '-_id').toArray(function(err, docs) {
    if (err) return reject(res, 'No Clicks 4 U.');
    res.status(200).json(docs);
  });
});

app.get('/times', cors({methods: ['GET']}), function(req, res) {
  if (!req || !req.headers || !req.headers.origin || !['https://snoozz.me', 'http://127.0.0.1:9000'].includes(req.headers.origin)) {
    return reject(res, 'Who are you?');
  }
  db.collection(T).find({}, '-_id').toArray(function(err, docs) {
    if (err) return reject(res, 'No Times 4 U.');
    res.status(200).json(docs);
  });
});

function setupTimes() {
  db.collection(T).insertMany(
  [
    {
      "when": "0000",
      "count": 0
    },
    {
      "when": "0015",
      "count": 0
    },
    {
      "when": "0030",
      "count": 0
    },
    {
      "when": "0045",
      "count": 0
    },
    {
      "when": "0100",
      "count": 0
    },
    {
      "when": "0115",
      "count": 0
    },
    {
      "when": "0130",
      "count": 0
    },
    {
      "when": "0145",
      "count": 0
    },
    {
      "when": "0200",
      "count": 0
    },
    {
      "when": "0215",
      "count": 0
    },
    {
      "when": "0230",
      "count": 0
    },
    {
      "when": "0245",
      "count": 0
    },
    {
      "when": "0300",
      "count": 0
    },
    {
      "when": "0315",
      "count": 0
    },
    {
      "when": "0330",
      "count": 0
    },
    {
      "when": "0345",
      "count": 0
    },
    {
      "when": "0400",
      "count": 0
    },
    {
      "when": "0415",
      "count": 0
    },
    {
      "when": "0430",
      "count": 0
    },
    {
      "when": "0445",
      "count": 0
    },
    {
      "when": "0500",
      "count": 0
    },
    {
      "when": "0515",
      "count": 0
    },
    {
      "when": "0530",
      "count": 0
    },
    {
      "when": "0545",
      "count": 0
    },
    {
      "when": "0600",
      "count": 0
    },
    {
      "when": "0615",
      "count": 0
    },
    {
      "when": "0630",
      "count": 0
    },
    {
      "when": "0645",
      "count": 0
    },
    {
      "when": "0700",
      "count": 0
    },
    {
      "when": "0715",
      "count": 0
    },
    {
      "when": "0730",
      "count": 0
    },
    {
      "when": "0745",
      "count": 0
    },
    {
      "when": "0800",
      "count": 0
    },
    {
      "when": "0815",
      "count": 0
    },
    {
      "when": "0830",
      "count": 0
    },
    {
      "when": "0845",
      "count": 0
    },
    {
      "when": "0900",
      "count": 0
    },
    {
      "when": "0915",
      "count": 0
    },
    {
      "when": "0930",
      "count": 0
    },
    {
      "when": "0945",
      "count": 0
    },
    {
      "when": "1000",
      "count": 0
    },
    {
      "when": "1015",
      "count": 0
    },
    {
      "when": "1030",
      "count": 0
    },
    {
      "when": "1045",
      "count": 0
    },
    {
      "when": "1100",
      "count": 0
    },
    {
      "when": "1115",
      "count": 0
    },
    {
      "when": "1130",
      "count": 0
    },
    {
      "when": "1145",
      "count": 0
    },
    {
      "when": "1200",
      "count": 0
    },
    {
      "when": "1215",
      "count": 0
    },
    {
      "when": "1230",
      "count": 0
    },
    {
      "when": "1245",
      "count": 0
    },
    {
      "when": "1300",
      "count": 0
    },
    {
      "when": "1315",
      "count": 0
    },
    {
      "when": "1330",
      "count": 0
    },
    {
      "when": "1345",
      "count": 0
    },
    {
      "when": "1400",
      "count": 0
    },
    {
      "when": "1415",
      "count": 0
    },
    {
      "when": "1430",
      "count": 0
    },
    {
      "when": "1445",
      "count": 0
    },
    {
      "when": "1500",
      "count": 0
    },
    {
      "when": "1515",
      "count": 0
    },
    {
      "when": "1530",
      "count": 0
    },
    {
      "when": "1545",
      "count": 0
    },
    {
      "when": "1600",
      "count": 0
    },
    {
      "when": "1615",
      "count": 0
    },
    {
      "when": "1630",
      "count": 0
    },
    {
      "when": "1645",
      "count": 0
    },
    {
      "when": "1700",
      "count": 0
    },
    {
      "when": "1715",
      "count": 0
    },
    {
      "when": "1730",
      "count": 0
    },
    {
      "when": "1745",
      "count": 0
    },
    {
      "when": "1800",
      "count": 0
    },
    {
      "when": "1815",
      "count": 0
    },
    {
      "when": "1830",
      "count": 0
    },
    {
      "when": "1845",
      "count": 0
    },
    {
      "when": "1900",
      "count": 0
    },
    {
      "when": "1915",
      "count": 0
    },
    {
      "when": "1930",
      "count": 0
    },
    {
      "when": "1945",
      "count": 0
    },
    {
      "when": "2000",
      "count": 0
    },
    {
      "when": "2015",
      "count": 0
    },
    {
      "when": "2030",
      "count": 0
    },
    {
      "when": "2045",
      "count": 0
    },
    {
      "when": "2100",
      "count": 0
    },
    {
      "when": "2115",
      "count": 0
    },
    {
      "when": "2130",
      "count": 0
    },
    {
      "when": "2145",
      "count": 0
    },
    {
      "when": "2200",
      "count": 0
    },
    {
      "when": "2215",
      "count": 0
    },
    {
      "when": "2230",
      "count": 0
    },
    {
      "when": "2245",
      "count": 0
    },
    {
      "when": "2300",
      "count": 0
    },
    {
      "when": "2315",
      "count": 0
    },
    {
      "when": "2330",
      "count": 0
    },
    {
      "when": "2345",
      "count": 0
    }
  ], function (err,doc) {
    if (err) return reject(res, 'm8 really');
    res.status(200).json({you: 'did it'});
  });
}

var validChoices = [
  'startup',
  'in-an-hour',
  'today-morning',
  'today-evening',
  'tom-morning',
  'tom-evening',
  'weekend',
  'monday',
  'week',
  'month',
  'custom'
];

// round time to nearest 15 mins
function calcTime(num) {
  var pad = n => n < 10 ? '0' + n : '' + n;
  var [h, m] = num.toString().match(/\d{2}/g).map(n => parseInt(n));
  if (Math.round(m/15) == 4) h = (h + 1) % 24;
  m = (Math.round(m/15) * 15) % 60;
  return pad(h) + pad(m);
}

app.post('/setupwhynot'. cors(), function(req, res) {
  setupTimes();
}

app.post('/clicks', cors({methods: ['POST']}), function(req, res) {
  if (!req || !req.headers || !req.headers.origin || !/^(safari-web\-|chrome\-|moz\-)?extension:\/\/.*/.test(req.headers.origin)) {
    if (req.headers && req.headers.origin) console.log(req.headers.origin);
    return reject(res, 'This is not the server you are looking for');
  }
  console.log('ANUSTAT: ' + req.body);
  if (typeof req.body !== 'string') {
    reject(res, 'Dont send me this garbage');
  } else if (validChoices.includes(req.body)) {
    db.collection(C).updateOne({option: req.body}, {$inc: {count: 1}}, function(err, doc) {
      if (err) return reject(res, 'I dont want it');
      res.status(200).json({nice: 'Noice'});
    });
  } else if (req.body.indexOf('.') > -1 && req.body.split('.').length === 2) {
    var [choice, time] = req.body.split('.');
    if (/^([0-1][0-9]|[2][0-3])[0-5][0-9]$/.test(time) && validChoices.includes(choice)) {
      db.collection(T).updateOne({when: calcTime(time)}, {$inc: {count: 1}});
      db.collection(C).updateOne({option: choice}, {$inc: {count: 1}});
      return res.status(200).json({nice: 'Noice'});
    }
    reject(res, 'We dont like your type here');
  } else {
    reject(res, 'Get out of my swamp');
  }
});