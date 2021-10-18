var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var db, C = 'clicks', T = 'times', app = express();

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
var trusted = ['https://snoozz.me', 'http://127.0.0.1:9000', 'http://127.0.0.1:8080'];
var extensions = new RegExp('^(safari-web\-|chrome\-|moz\-)?extension:\/\/.*');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.text({limit: '1kb'}));

mongodb.MongoClient.connect(process.env.MONGODB_URI, {useUnifiedTopology: true}, (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database.db('stats');
  var server = app.listen(process.env.PORT || 8080, _ => console.log('Hello there. How nice of you to join us port ' + server.address().port));
});

function reject(res, where, msg) {
  res.status(204).json({why: msg});
  console.log(where + ' ERROR - ' + msg);
}

app.get('/clicks', cors({methods: ['GET']}), (req, res) => {
  if (!req || !req.headers || !req.headers.origin || !trusted.includes(req.headers.origin)) {
    return reject(res, 'GET CLICKS: ', 'Who are you? ' + req.headers.origin);
  }
  db.collection(C).find({}, {projection: {_id: 0}}).toArray((err, docs) => {
    if (err) return reject(res, 'GET CLICKS: ', 'No Clicks 4 U.');
    res.status(200).json(docs);
  });
});

app.get('/times', cors({methods: ['GET']}), (req, res) => {
  if (!req || !req.headers || !req.headers.origin || !trusted.includes(req.headers.origin)) {
    return reject(res, 'GET TIMES:  ', 'Who are you? ' + req.headers.origin);
  }
  db.collection(T).find({}, {projection: {_id: 0}}).toArray((err, docs) => {
    if (err) return reject(res, 'GET TIMES:  ', 'No Times 4 U.');
    res.status(200).json(docs);
  });
});

app.get('/total_clicks', cors({methods: ['GET']}), (req, res) => {
  db.collection(C).aggregate([{$group: {_id: null, 'total': {$sum: '$count'}}}]).toArray((err, docs) => {
    if (err || !docs || !docs.length || !docs[0].total || isNaN(parseInt(docs[0].total))) return reject(res, 'GET TOTAL:  ', 'Addition is hard.');
    res.status(200).send(`${docs[0].total}`);
  });
});

// round time to nearest 15 mins
function calcTime(num) {
  var pad = n => (n < 10 ? '0' : '') + n;
  var [h, m] = num.toString().match(/\d{2}/g).map(n => parseInt(n));
  h = (Math.round(m/15) == 4) ? (h + 1) % 24 : h;
  m = (Math.round(m/15) * 15) % 60;
  return pad(h) + pad(m);
}

app.post('/clicks', cors({methods: ['POST']}), function(req, res) {
  if (!req || !req.headers || !req.headers.origin || !extensions.test(req.headers.origin)) {
    var intruder = (req.headers && req.headers.origin) ? req.headers.origin : 'stranger danger';
    return reject(res, 'POST CLICKS:', 'This is not the server you are looking for | ' + intruder);
  }
  if (!req.body || typeof req.body == 'undefined'|| (typeof req.body !== 'string' && req.body.length)) {
    reject(res, 'POST CLICKS:', 'Dont send me this garbage');
  } else if (req.body === 'startup' || (req.body.indexOf && req.body.indexOf('.') > -1 && req.body.split && req.body.split('.').length === 2)) {
    var [choice, time] = req.body.split('.'), output = [];

    if (choice && validChoices.includes(choice)) {
      db.collection(C).updateOne({option: choice}, {$inc: {count: 1}});
      output.push(choice);
    }
    if (time && /^([0-1][0-9]|[2][0-3])[0-5][0-9]$/.test(time)) {
      db.collection(T).updateOne({when: calcTime(time)}, {$inc: {count: 1}});
      output.push(calcTime(time));
    }

    if (output.length) {
      res.status(200).json({nice: 'Noice'});
      console.log('NEW STAT:    ' + req.body + (output.length ? ' | ' + output.join(' ') : ''));
    } else {
      reject(res, 'POST CLICKS:', 'We dont like your type here | ' + req.body);
    }
  } else if (validChoices.includes(req.body)) {
    db.collection(C).updateOne({option: req.body}, {$inc: {count: 1}}, function(err, doc) {
      if (err) return reject(res, 'POST CLICKS', 'I dont want it | ' + req.body);
      res.status(200).json({nice: 'Noice'});
      console.log('OLD STAT:    ' + req.body);
    });
  } else {
    reject(res, 'POST CLICKS:', 'Get out of my swamp | ' + req.body);
  }
});