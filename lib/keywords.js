var dates = require('./dates');
var db = require('./db');
var _ = require('lodash');

exports.find = function(search, cb){

  if (arguments.length === 1){
    query = {};
    cb = arguments[0];
  }

  var params = [dates.getFrom(search.from), dates.getTo(search.to)];
  var query = "select stem, max(text) as text, " + 
    "string_agg(distinct(text), ',') as terms, sum(frequency) as frequency ";
 
  if (search.house || search.party){
    query += "from phrases_houses_summaries " + 
      "where date between $1 and $2 ";
    if (search.house){
      params.push(search.house);
      query += 'and house = $' + params.length + ' ';
    }
    if (search.party){
      params.push(search.party);
      query += 'and party = $' + params.length + ' ';
    }
  }else if (search.speaker_id){
    query += "from phrases_speaker_ids_summaries " + 
      "where date between $1 and $2 ";
    params.push(search.speaker_id);
    query += 'and speaker_id = $' + params.length + ' ';
  }else if (search.person_id){
    query += "from phrases_person_ids_summaries " + 
      "where date between $1 and $2 ";
    params.push(search.person_id);
    query += 'and person_id = $' + params.length + ' ';
  }else{
    query += "from phrases_summaries " + 
      "where date between $1 and $2 ";
  }

  query += "group by stem " +
    "order by frequency desc " +
    "limit 40";

  db.query(query, params, function(err, result) {
    if (err) return cb(err);
    cb(err, result.rows);
  });

};
