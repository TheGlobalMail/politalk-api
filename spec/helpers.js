var db = require('../lib/db');
var fs = require('fs');
var Hansard = require('../lib/hansard');
var request = require('request');
var assert = require('assert');
var _ = require('lodash');
var cache = require('../lib/cache');

var testsRunning = 0;
var port = 8085;
var schemaLoaded = false;

exports.server = null;

exports.startApp = function(app, cb){
  if (!testsRunning){
    exports.server = app.listen(port, cb);
    testsRunning++;
  }else{
    cb();
  }
};

exports.url = 'http://localhost:' + port;

exports.stopApp = function(cb){
  testsRunning--;
  if (!testsRunning){
    db.end();
    exports.server.close(cb);
  }else{
    cb();
  }
};

exports.loadSchema = function(cb){
  if (schemaLoaded){
    return db.query('delete from hansards; delete from member', cb);
  }
  var query = fs.readFileSync(__dirname + '/../db/schema.sql').toString();
  schemaLoaded = true;
  db.query(query, cb);
};

exports.loadMemberFixture = function(cb){
  var query = fs.readFileSync(__dirname + '/fixtures/member.sql').toString();
  db.query(query, cb);
};

exports.calculateMemberSummaries = function(cb){
  var query = fs.readFileSync(__dirname + '/../db/member_summaries.sql').toString();
  db.query(query, cb);
};

exports.loadHansardFixtures = function(cb){
  var html = '';
  var i = 0;
  var speech;
  while (i < 12){
    html = html + 'politalk api and ';
    i++;
  }
  speech = {
    id: 'test', date: new Date('2012-10-10'), 
    html: html, headingId: 1, subHeadingId: 1, 
    duration: 600,
    speaker_id: 265, speaker: 'John Howard', timeOfDay: '11:00'
  };
  Hansard.addSpeech(speech, cb);
};

exports.calculatePhraseSummaries = function(cb){
  var query = fs.readFileSync(__dirname + '/../db/phrases_summaries.sql').toString();
  db.query(query, cb);
};

exports.calculateSummary = function(cb){
  var query = fs.readFileSync(__dirname + '/../db/summary.sql').toString();
  db.query(query, cb);
};

exports.rebuildMembersCache = function(cb){
  var stream = cache.rebuildMembersCache(); 
  stream.on('end', function(){
    cb();
  });
  stream.write({});
  stream.on('error', function(err){ return cb(err); });
  stream.end();
};

exports.loadSummaryFixture = function(cb){
  var query = fs.readFileSync(__dirname + '/fixtures/summary.sql').toString();
  db.query(query, cb);
};

exports.loadSearchIndexes = function(cb){
  var query = fs.readFileSync(__dirname + '/../db/tokens_wordchoices.sql').toString();
  var insert = "insert into wordchoice_tokens_cluster_a (word1,token1,hansard_id,party,date) values ('apis','api','test1','Liberal Party','2012-10-10')";
  db.query(query, function(err){
    if (err) return cb(err);
    db.query(insert, cb);
  });
};

exports.testApi = function(url, cb){
  request(url, function(err, res, body){
    var json;
    assert(!err);
    assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
    json = JSON.parse(body);
    assert(_.isArray(json));
    cb(err, json);
  });
};

exports.clearWordChoicesCache = function(cb){
  db.query('delete from wordchoices_cache', cb);
};

exports.cleanup = function(){
  db.end();
};
