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

app.get('/times', cors({methods: ['GET']}), function(req, res) {
  if (!req || !req.headers || !req.headers.origin || !['https://snoozz.me', 'http://127.0.0.1:9000'].includes(req.headers.origin)) {
    return reject(res, 'Who are you?')
  }
  db.collection(T).find({}, {_id: 0}).toArray(function(err, docs) {
    if (err) {
      return reject(res, 'No Stats 4 U.');
    }
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
  if (Math.round(m/15) == 0) m = 0;
  if (Math.round(m/15) == 1) m = 15;
  if (Math.round(m/15) == 2) m = 30;
  if (Math.round(m/15) == 3) m = 45;
  if (Math.round(m/15) == 4) {
    h = (h + 1) % 24;
    m = 0;
  }
  return pad(h) + pad(m);
}

app.post('/clicks', cors({methods: ['POST']}), function(req, res) {
  if (!req || !req.headers || !req.headers.origin || !/^(safari-web\-|chrome\-|moz\-)?extension:\/\/.*/.test(req.headers.origin)){
    return reject(res, 'I dont even know who you are')
  }
  if (typeof req.body !== 'string') {
    return reject(res, 'Get out of my swamp');
  }
  if (!validChoices.includes(req.body)) {
    return reject(res, 'Get out of my swamp');
  } else {
    db.collection(C).update({option: req.body}, {$inc: {count: 1}}, function(err, doc) {
      if (err) {
        return reject(res, 'I dont want it');
      }
      res.status(200).json({nice: 'Noice'});
    });
  }
  if (req.body.indexOf('.') > -1) {
    var bs = req.body.split('.');
    if (bs.length !== 2 || validChoices.includes(bs[0]) || !/^([0-1][0-9]|[2][0-3])[0-5][0-9]$/.test(bs[1])) {
      console.log('invalid | '+ bs[0] + ' | ' + bs[1]);
    } else {
      console.log('yes welcome in | '+ bs[0] + ' | ' + bs[1] + ' | ' + calcTime(bs[1]));
      // db.collection(C).update({option: bs[0]}, {$inc: {count: 1}}, function(err, doc) {
      //   if (err) {
      //     return reject(res, 'I dont want it');
      //   }
      //   res.status(200).json({nice: 'Noice'});
      // });
      // db.collection(T).update({option: calcTime(bs[1])}, {$inc: {count: 1}});
    }
  }
  
});