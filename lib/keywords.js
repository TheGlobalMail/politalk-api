var dates = require('./dates');
var db = require('./db');
var _ = require('lodash');
var async = require('async');
var moment = require('moment');

exports.find = function(search, cb){

  if (arguments.length === 1){
    query = {};
    cb = arguments[0];
  }

  var params = [dates.getFromYear(search.from) + '-' + dates.getToYear(search.to)];
  var query = 'select data ';
  var yearQuery = 'where year = $1 ';
 
  if (search.party){
    params.push(search.party);
    query += 'from phrases_party_list ' + yearQuery;
    query += 'and party = $' + params.length + ' ';
  }else if (search.speaker_id){
    query += 'from phrases_speaker_ids_list ' + yearQuery;
    params.push(search.speaker_id);
    query += 'and speaker_id = $' + params.length + ' ';
  }else{
    query += 'from phrases_list ' + yearQuery;
  }

  console.error(query)
  console.error(params)
  db.query(query, params, function(err, result) {
    if (err) return cb(err);
    if (!result.rows.length){
      cb(err, {});
    }else{
      cb(err, result.rows[0].data);
    }
  });

};

exports.findOnPhrases = function(search, cb){

  if (arguments.length === 1){
    query = {};
    cb = arguments[0];
  }

  var params = [dates.getFromYear(search.from), dates.getToYear(search.to)];
  var query = "select stem, max(text) as text, " + 
    "string_agg(distinct(text), ',') as terms, sum(frequency) as frequency ";
 
  if (search.party){
    params.push(search.party);
    query += "from phrases_party_summaries " + 
    query += 'and party = $' + params.length + ' ';
  }else if (search.speaker_id){
    query += "from phrases_speaker_ids_summaries " + 
      "where year between $1 and $2 ";
    params.push(search.speaker_id);
    query += 'and speaker_id = $' + params.length + ' ';
  }else{
    query += "from phrases_summaries " + 
      "where year between $1 and $2 ";
  }

  query += "group by stem " +
    "order by frequency desc " +
    "limit 40";

  console.error('running: ' + query)
  console.error(params);
  var date = new Date();
  db.query(query, params, function(err, result) {
    if (err) return cb(err);
    cb(err, result.rows)
  });

};


exports.generateLists = function(cb){
  var steps = [
    exports.generateYearList,
    exports.generatePartyList,
    exports.generateSpeakerList
  ];
  async.series(steps, cb);
};

exports.generateYearList = function(cb){
  var years = exports.getYearCombinations();
  async.forEachSeries(years, function(yearRange, next){
    var search = {};
    var rangeAsString = null;
    if (yearRange){
      search.from = yearRange[0];
      search.to = yearRange[1];
      console.error('searching..' + search.from + ' to ' + search.to);
      rangeAsString = [search.from, search.to].join('-');
    }
    exports.findOnPhrases(search, function(err, results){
      var insert = 'insert into phrases_list (lastupdate, year, data) values (current_timestamp, $1, $2)';
      var update = 'update phrases_list set lastupdate=current_timestamp, data=$2 where year = $1';
      var values = [rangeAsString, JSON.stringify(results)];
      console.error('upsert ' + rangeAsString);
      db.upsert(insert, update, values, next);
    });
  }, cb);
};

exports.generatePartyList = function(cb){
  return cb();


  var years = exports.getYearCombinations();
  var parties;
  async.forEachSeries(years, function(yearRange, next){
    var search = {};
    var rangeAsString = null;
    if (yearRange){
      search.from = yearRange[0];
      search.to = yearRange[1];
      console.error('searching..' + search.from + ' to ' + search.to);
      rangeAsString = [search.from, search.to].join('-');
    }
    var start = new Date();
    exports.findOnPhrases(search, function(err, results){
      var insert = 'insert into phrases_party_list (lastupdate, year, party, data) values (current_timestamp, $1, $2, $3)';
      var update = 'update phrases_party_list set lastupdate=current_timestamp, data=$3 where year = $1 and party = $2';
      var values = [rangeAsString, party, JSON.stringify(results)];
      console.error('upsert ' + rangeAsString);
      var end = new Date();
      var duration = moment.duration(end.getTime() - start.getTime()).humanize();
      console.error('done in : ' + duration);
      db.upsert(insert, update, values, next);
    });
  }, cb);
};

exports.generateSpeakerList = function(cb){
  cb();
};

exports.getYearCombinations = function(){
  var startYear = 2006;
  var endYear = (new Date()).getFullYear();
  var combinations = [];
  for (var from = startYear; from <= endYear; from++){
    for (var to = from; to <= endYear; to++){
      combinations.push([from, to]);
    }
  }
  return combinations;
};
