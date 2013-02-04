var db = require('./db');
var _ = require('lodash');
var gramophone = require('gramophone');
var async = require('async');
var extraStopWords = require('./stopwords.json');
var natural = require('natural');

var gramophoneOptions = {
  ngrams: [2, 3, 4],
  startWords: [
    'new south wales',
    'australian capital territory',
    'human right'
  ],
  stopWords: extraStopWords,
  html: true,
  score: true
};

exports.Parser = require('./hansard/parser').Parser;
exports.Phrases = require('./hansard/phrases');
exports.speechStream = require('./hansard/speech-stream');

exports.end = db.end;

exports.addHeading = function(attrs, cb){
  var values = [attrs.id, db.formatDate(attrs.date), attrs.html];
  var insert = "INSERT INTO hansards (id, date, html, major) SELECT $1, $2, $3, true";
  var update = "UPDATE hansards SET date=$2, html=$3, major=true WHERE id=$1;";
  db.upsert(insert, update, values, cb);
};

exports.addSubHeading = function(attrs, cb){
  var values = [attrs.id, attrs.date, attrs.html, attrs.headingId];
  var insert = "INSERT INTO hansards (id, date, html, major_id, minor) SELECT $1, $2, $3, $4, true";
  var update = "UPDATE hansards SET date=$2, html=$3, major_id = $4, minor=true WHERE id=$1;";
  db.upsert(insert, update, values, cb);
};

exports.lastSpeechDate = function(cb){
  var query = 'select date from hansards order by date desc limit 1';
  db.query(query, function(err, result){
    cb(err, result && result.rows[0] && result.rows[0].date);
  });
};


exports.addSpeech = function addSpeech(attrs, cb){
  var speakerId = attrs.speaker_id === 'unknown' ? null : parseInt(attrs.speaker_id, 10);
  var query = 'SELECT 1 FROM hansards WHERE id=$1';
  var time = exports.workOutTime(attrs.date, attrs.timeOfDay);
  var values = [attrs.id, db.formatDate(attrs.date), attrs.html, attrs.headingId, attrs.subHeadingId, 
      speakerId, attrs.speaker, attrs.timeOfDay, time, attrs.words, attrs.duration, attrs.talktype];
  var parser = this;
  var insert = "INSERT INTO hansards (id, date, html, major_id, minor_id, speaker_id, speaker, time_of_day, time, words, duration, talktype) " + 
      "SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12";
  var update = "UPDATE hansards SET date=$2, html=$3, major_id = $4, minor_id = $5, speaker_id = $6" + 
      ", speaker = $7, time_of_day = $8, time = $9, words = $10, duration = $11, talktype = $12 WHERE id=$1;";

  var upsertAndExtractKeywords = function(cb){
    db.upsert(insert, update, values, function(err){
      if (err) return cb(err);
      exports.extractKeywords(attrs.id, attrs.html, db.formatDate(attrs.date), cb);
    });
  };

  // Check to see if there is a matching member by member_id, if not, 
  // fallback to using the person_id
  db.query("select member_id from member where member_id = $1", [speakerId], function(err, result){
    if (err) return cb(err);
    if (result.rowCount){
      upsertAndExtractKeywords(cb);
    }else{
      db.query("select member_id from member where person_id = $1", [speakerId], function(err, result){
        if (err) return cb(err);
        if (result.rowCount){
          values[5] = result.rows[0].member_id;
        }else{
          if (process.env.NODE_ENV !== 'test'){
            //console.error("Could not find member with person_id = " + speakerId + ' on ' + attrs.id + ' (' + attrs.speaker + ')');
          }
        }
        upsertAndExtractKeywords(cb);
      });
    }
  });
};

exports.extractKeywords = function(speechId, html, date, cb){
  var results = gramophone.extract(html, gramophoneOptions);
  var query = "delete from phrases where hansard_id = $1";
  db.query(query, [speechId], function(err){
    if (err) return cb(err);
    async.forEach(results, function(result, done){
      var stem = _.map(result.term.split(' '), natural.PorterStemmer.stem).join(" ");
      var query = "INSERT INTO phrases (hansard_id, text, stem, frequency, date) SELECT $1, $2, $3, $4, $5";
      db.query(query, [speechId, result.term, stem, result.tf, date], done);
    }, cb);
  });
};


exports.byId = function(id, cb){
  var sql = 'select * from hansards where id = $1';
  db.query(sql, [id], function(err, result){
    if (err) return cb(err);
    cb(err, result.rows[0]);
  });
};

exports.clear = function(cb){
  if (process.env.NODE_ENV !== 'test'){
    console.error('Hansard.clear ignored because not in test');
    return cb();
  }
  db.query('delete from hansards', cb);
};

exports.workOutTime = function(date, timeOfDay){
  var parsedTime;

  if (!timeOfDay) return date;

  parsedTime = _.map(timeOfDay.split(':'), function(d){ return parseInt(d, 10); });
  if (parsedTime.length){
    date.setHours(parsedTime[0]);
    date.setMinutes(parsedTime[1]);
  }
  return date;
};

exports.createStream = function(ids){
  var sql = 'select * from hansards where id in (' + _.map(ids.split(','), function(id){ return "'" + sanitiseId(id) + "'"; }) + ') order by date, time limit 50';
  return db.createStream(sql);
};

exports.find = function(ids, cb){
  var sql = 'select * from hansards where id in (' + _.map(ids.split(','), function(id){ return "'" + sanitiseId(id) + "'"; }) + ') order by date, time limit 50';
  db.query(sql, db);
};

function sanitiseId(id){
  return id.replace(/[^a-z0-9\-\.]/ig, '');
}
