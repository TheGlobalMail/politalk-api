var members = require('./lib/members');
var db = require('./lib/db');
var async = require('async');
var request = require('request');

var query = 'select * from member where image is null';
db.query(query, function(err, result) {
  if (err) throw err; 
  var members = result.rows;
  async.forEach(members, function(member, cb){
    var url = 'http://politalk.herokuapp.com/modules/members/members-img/mpsL/' + member.person_id + '.jpg';
    request(url, function(err, res){
      if (!err && res.statusCode == 200){
        console.error("found " + url + " for " + member.first_name + " " + member.last_name);
        db.query('update member set image = $1 where person_id = $2', [url, member.person_id], cb);
      }else{
        console.error("failed to find for " + member.first_name + " " + member.last_name);
        cb();
      }
    });
  });
});
