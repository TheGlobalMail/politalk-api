var dates = require('./dates');
var db = require('./db');
var _ = require('lodash');
var async = require('async');
var wordchoices = require('./wordchoices');
var es = require('event-stream');

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
  var query = 'select stem, max(text) as text, ' +
    'string_agg(distinct(text), \',\') as terms, sum(frequency) as frequency ';
  var yearQuery = 'where year between $1 and $2 ';
 
  if (search.party){
    params.push(search.party);
    query += 'from phrases_party_summaries ' + yearQuery;
    query += 'and party = $' + params.length + ' ';
  }else if (search.speaker_id){
    query += 'from phrases_speaker_ids_summaries ' + yearQuery;
    params.push(search.speaker_id);
    query += 'and speaker_id = $' + params.length + ' ';
  }else{
    query += 'from phrases_summaries ' + yearQuery;
  }

  query += 'group by stem ' +
    'order by frequency desc ' +
    'limit 40';

  db.query(query, params, function(err, result) {
    if (err) return cb(err);
    var rows = result.rows;
    async.forEachSeries(rows, function(row, next){
      wordchoices.forTerm(row.text, search, function(err, termInfo){
        if (err) return next(err);
        row.score = row.frequency;
        if (row.text.split(' ').length < 4){
          // correct the score if the 2 or 3 word phrases
          row.wordchoices = _.inject(termInfo.data, function(sum, datum){
            return sum + datum.freq;
          }, 0);
          row.frequency = _.max([row.score, row.wordchoices]);
          console.error('corrected ' + row.text + ' from ' + row.score + ' to ' + row.wordchoices + ' and used ' + row.frequency);
        }
        next();
      });
    }, function(err){
      if (err) return cb(err);
      cb(null, _.sortBy(rows, 'frequency').reverse());
    });
  });

};


exports.generateListsStream = function(cb){

  return es.through(

    function write(data){
      this.newData = true;
      this.emit('data', data);
    },
    
    function end(){
      var _this = this;
      if (!this.newData) return this.emit('end');
      exports.generateLists(function(err){
        if (err) return _this.emit('error', err);
        _this.emit('end');
      });
    }
  );
};

exports.generateLists = function(cb){
  var years = exports.getYearCombinations();
  var steps = _.map([
    exports.generateYearList,
    exports.generatePartyList,
    exports.generateSpeakerList
  ], function(fn){
    return function(cb){ fn(years, cb); };
  });
  async.series(steps, cb);
};

exports.generateYearList = function(years, cb){
  console.error('Generating year lists');
  async.forEachSeries(years, function(yearRange, next){
    var search = {};
    var rangeAsString = null;
    if (yearRange){
      search.from = yearRange[0];
      search.to = yearRange[1];
      rangeAsString = [search.from, search.to].join('-');
    }
    console.error('doing range: ' + yearRange);
    exports.findOnPhrases(search, function(err, results){
      var insert = 'insert into phrases_list (lastupdate, year, data) values (current_timestamp, $1, $2)';
      var update = 'update phrases_list set lastupdate=current_timestamp, data=$2 where year = $1';
      var values = [rangeAsString, JSON.stringify(results)];
      db.upsert(insert, update, values, next);
    });
  }, cb);
};

exports.generatePartyList = function(years, cb){
  console.error('Generating party lists');
  exports.getAllParties(function(err, result){
    if (err) return cb(err);
    var parties = _.pluck(result.rows, 'party');
    async.forEachSeries(parties, function(party, next){
      async.forEachSeries(years, function(yearRange, next){
        var search = {};
        var rangeAsString = null;
        if (yearRange){
          search.from = yearRange[0];
          search.to = yearRange[1];
          search.party = party;
          rangeAsString = [search.from, search.to].join('-');
        }
        exports.findOnPhrases(search, function(err, results){
          var insert = 'insert into phrases_party_list (lastupdate, year, party, data) values (current_timestamp, $1, $2, $3)';
          var update = 'update phrases_party_list set lastupdate=current_timestamp, data=$3 where year = $1 and party = $2';
          var values = [rangeAsString, party, JSON.stringify(results)];
          db.upsert(insert, update, values, next);
        });
      }, next);
    }, cb);
  });
};

exports.generateSpeakerList = function(years, cb){
  exports.getAllSpeakers(function(err, result){
    if (err) return cb(err);
    var speakers = _.pluck(result.rows, 'speaker_id');
    console.error('Generating speaker lists');
    async.forEachSeries(speakers, function(speaker, next){
      async.forEachSeries(years, function(yearRange, next){
        var search = {};
        var rangeAsString = null;
        if (yearRange){
          search.from = yearRange[0];
          search.to = yearRange[1];
          search.speaker_id = speaker;
          rangeAsString = [search.from, search.to].join('-');
        }
        exports.findOnPhrases(search, function(err, results){
          var insert = 'insert into phrases_speaker_ids_list (lastupdate, year, speaker_id, data) values (current_timestamp, $1, $2, $3)';
          var update = 'update phrases_speaker_ids_list set lastupdate=current_timestamp, data=$3 where year = $1 and speaker_id = $2';
          var values = [rangeAsString, speaker, JSON.stringify(results)];
          db.upsert(insert, update, values, next);
        });
      }, next);
    }, cb);
  });
};

exports.getYearCombinations = function(){
  var startYear = 2006;
  var endYear = (new Date()).getFullYear();
  var combinations = [];
  for (var from = startYear; from <= endYear; from++){
    combinations.push([from, endYear]);
  }
  return combinations;
};

exports.getAllYearCombinations = function(){
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

exports.getAllParties = function(cb){
  var exclude = ['SPK', 'Deputy-President', 'PRES', 'Deputy-Speaker', 'President', 'Speaker', 'CWM', 'DPRES'];
  var query = 'select distinct(party) from phrases_party_summaries where party not in (';
  query += _.map(exclude, function(party){ return '\'' +  party + '\''; }).join(',');
  query += ')';
  db.query(query, [], cb);
};

exports.getAllSpeakers = function(cb){
  var query = 'select distinct(speaker_id) from phrases_speaker_ids_summaries';
  db.query(query, [], cb);
};
