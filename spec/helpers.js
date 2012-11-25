var db = require('../lib/db');
var fs = require('fs');

exports.clearHansard = function(cb){
  db.query('delete from hansards', [], cb);
};

exports.clearMembers = function(cb){
  var query = fs.readFileSync(__dirname + '/fixtures/member.sql').toString();
  db.query(query, cb);
};

exports.loadAllMembers = function(cb){
  var query = "INSERT INTO  member (member_id, house, first_name, last_name, constituency, party, entered_house, left_house, entered_reason, left_reason, person_id, title) " +
      "SELECT 265,1,'John','Howard','Bennelong','Liberal Party','1974-05-18','2007-11-24','general_election','',10313, ''";
  db.query(query, cb);
};

exports.cleanup = function(){
  db.end();
};
