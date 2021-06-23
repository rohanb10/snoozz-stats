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
  db.collection(C).find({}, {projection: {_id: 0}}).toArray(function(err, docs) {
    if (err) return reject(res, 'No Clicks 4 U.');
    res.status(200).json(docs);
  });
});

app.get('/times', cors({methods: ['GET']}), function(req, res) {
  if (!req || !req.headers || !req.headers.origin || !['https://snoozz.me', 'http://127.0.0.1:9000'].includes(req.headers.origin)) {
    return reject(res, 'Who are you?');
  }
  db.collection(T).find({}, {projection: {_id: 0}}).toArray(function(err, docs) {
    if (err) return reject(res, 'No Times 4 U.');
    res.status(200).json(docs);
  });
});

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