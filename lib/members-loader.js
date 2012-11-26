var es = require('event-stream');
var db = require('./db');

module.exports =  es.map(function(data, cb){
  var values = [
    data.member_id,
    data.house,
    data.first_name,
    data.last_name,
    data.constituency,
    data.party,
    data.entered_house,
    data.left_house,
    data.entered_reason,
    data.left_reason,
    data.person_id,
    data.title,
    data.image
  ];
  var insert = "INSERT INTO member (member_id, house, first_name, last_name, " +
    "constituency, party, entered_house, left_house, entered_reason, " +
    "left_reason, person_id, title, image) " +
    "SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13";
  var update = "UPDATE member SET house=$2, first_name=$3, last_name = $4, " +
      "constituency=$5, party=$6, entered_house = $7, " +
      "left_house = $8, entered_reason = $9, left_reason = $10, " + 
      "person_id = $11, title = $12, image = $13" +
      "WHERE member_id = $1";
  db.upsert(insert, update, values, cb);
});
