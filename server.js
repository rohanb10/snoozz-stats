var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var COLLECTION = "clicks";
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
]

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({why: message});
}

app.get("/clicks", function(req, res) {
  db.collection(COLLECTION).find({}).toArray(function(err, docs) {
    if (err) return handleError(res, err.message, "Failed to get clicks.");
    res.status(200).json(docs);
  });
});

app.post("/clicks", function(req, res) {
  try {console.log('ROHANROHANROHANROHANROHAN', req, req.query, req.query.length, typeof req.query)} catch{}
  if (!req || !req.query || !req.query.length || typeof req.query != 'string') return handleError(res, 'Bad Input', 'Get out of my swamp', 400);

  var option = new URLSearchParams(req.query).get('o');
  try {console.log('ROHANROHANROHANROHANROHAN', option, valid_options.includes(option))} catch{}
  if (!option || !valid_options.includes(option)) return handleError(res, 'Bad Input', 'Get out of my swamp', 400);

  db.collection(COLLECTION).update({name: option}, {$inc: {count: 1}}, function(err, doc) {
    if (err) return handleError(res, err.message, 'Failed to save choice');
    res.status(200).json(doc.ops[0]);
  })
});
