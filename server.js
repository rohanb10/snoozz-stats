var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var db, C = 'clicks', app = express();
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
    var port = server.address().port;
    console.log('App now running on port', port);
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
  db.collection(C).find({}, {_id: 0}).toArray(function(err, docs) {
    if (err) {
      return reject(res, 'No Stats 4 U.');
    }
    res.status(200).json(docs);
  });
});

const valid = [
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
  if (!req || !req.headers || !req.headers.origin || !/^(safari-web\-|chrome\-|moz\-)?extension:\/\/.*/.test(req.headers.origin)){
    return reject(res, 'I dont even know who you are')
  }
  if (typeof req.body !== 'string' || !valid.includes(req.body)) {
    return reject(res, 'Get out of my swamp');
  }

  db.collection(C).update({option: req.body}, {$inc: {count: 1}}, function(err, doc) {
    if (err) {
      return reject(res, 'I dont want it');
    }
    res.status(200).json({nice: 'Noice'});
  })
});