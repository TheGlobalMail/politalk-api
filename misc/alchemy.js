var request = require('request');
var _ = require('lodash');
var _str = require('underscore.string');
var async = require('async');

var TRUNCATE_LENGTH = 40;
var ALCHEMY_TRUNCATE_LENGTH = 25000;

var blacklist = [
  'Acting Prime Minister',
  'madam',
  'no point',
  'project',
  'report',
  'australia',
  'Deputy Speaker',
  'supplementary question',
  'Prime Minister',
  'supplementary question',
  'the prime minister',
  'second reading',
  'australian',
  'Deputy President',
  'a question',
  'reports',
  'Deputy Speaker',
  'legislation',
  'question time',
  'bills',
  'yesterday',
  'legislastion',
  'document',
  'supplementary question',
  'the senator',
  'the bill ',
  'this afternoon',
  'resume',
  'the question',
  'first reading',
  'second reading',
  'third reading',
  'this day',
  'federal government ',
  'shadow minister',
  'questions',
  'no doubt',
  'my friend',
  'both sides'
]

//var url = 'http://access.alchemyapi.com/calls/html/HTMLGetRankedKeywords';
var url = 'http://access.alchemyapi.com/calls/text/TextGetRankedKeywords'

var mysql      = require('mysql');
var connection;

var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

if (process.env.DATABASE_URL){
  connection = mysql.createConnection(process.env.DATABASE_URL);
}else{
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'openaustralia'
  });
}

connection.connect();

function generateKeywords(){

  clearKeywords(function(err){

    if (err) return complete(err);

    var query = 'select distinct(hdate) as extract from hansard where hdate is not null order by hdate';
    connection.query(query, function(err, dates, fields){
      async.forEach(dates, function(hansard, done){
        var date = hansard.extract;
        extractKeywordsForDate(date, function(err, text, results){
          if (err) return done(err);
          storeResults(date, text, results, done);
        });
      }, complete);
    });

  });
}

function complete(err){
  connection.end();
  if (err){
    console.error('error: ' + err);
  }else{
    console.error('ok');
  }
};

function clearKeywords(cb){
  var query = 'delete from keywords';
  connection.query(query, cb);
}

function alchemy(text, cb){
  var params = {
    apikey: 'caf21fd23d9f5ccbf4338ac90db1486183e8d770',
    //maxRetrieve: 30,
    keywordExtractMode: 1,
    //sentiment: 1,
    outputMode: 'json',
    text: text,
  };

  request({method: 'POST', url: url, form: params}, function(err, res, body){
    var json;
    if (err){
      console.error(err);
    }else{
      json = JSON.parse(body);
      if (json.status == 'ERROR'){
        console.error(json.statusInfo);
      }
      cb(null, text, body);
    }
  });
}

function extractKeywordsForDate(date, cb){

  var query = 'select hdate, body from hansard inner join epobject on epobject.epobject_id = hansard.epobject_id ' +
    'where hdate = ? order by htime';

  connection.query(query, [date], function(err, sections, fields){
    var tokenized, text;

    if (err) return console.error(err);

    text = _.map(sections, function(section){
      var tokens = tokenizer.tokenize(_str.stripTags(section.body));
      return tokens.slice(0, TRUNCATE_LENGTH).join(' '); // truncate the text
    }).join("\n");
    tokenized = tokenizer.tokenize(text)
    console.log(text.length + " characters, " + Buffer.byteLength(text, 'utf8') + " bytes with " + tokenized.length + " words");
    tokenized = tokenized.slice(0, ALCHEMY_TRUNCATE_LENGTH);
    text = tokenized.join(' ');
    // Strip out black list words
    text = text.replace(new RegExp(blacklist.join('|'), 'ig'), '');
    console.log("POST: " + text.length + " characters, " + Buffer.byteLength(text, 'utf8') + " bytes with " + tokenized.length + " words");

    alchemy(text, cb);

  });

}

function storeResults(date, submitted, results, cb){
  var query = 'insert into keywords (extracted, submitted, results, generated) values (?,?,?,?)';
  connection.query(query, [date, submitted, results, new Date()], cb);
}

generateKeywords();
