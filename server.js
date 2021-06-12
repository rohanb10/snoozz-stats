var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var db, COLLECTION = 'clicks', app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors({methods: ['GET', 'POST']}))

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database.db('stats');
  console.log('Database connection ready');

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log('App now running on port', port);
  });
});

function handleError(res, msg, code) {
  console.log('ERROR: ' + msg);
  res.status(code || 500).json({why: msg});
}

app.get('/clicks', cors({methods: ['GET'], origin: ['https://snoozz.me', 'http://127.0.0.1:9999']}), function(req, res) {
  db.collection(COLLECTION).find({}, {_id: 0}).toArray(function(err, docs) {
    if (err) return handleError(res, 'No Stats 4 U.', 503);
    res.status(200).json(docs);
  });
});

const valid_options = [
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

app.post('/clicks', cors({methods: ['POST']}), function(req, res) {
  if (!req || !req.body || typeof req.body !== 'string' || !req.body.length || !valid_options.includes(req.body)) {
    return handleError(res, 'Get out of my swamp', 418);
  }

  db.collection(COLLECTION).update({option: req.body}, {$inc: {count: 1}}, function(err, doc) {
    if (err) return handleError(res, 'I dont want it');
    res.status(200).json({nice: 'Noice'});
  })
});