process.env.NODE_ENV = 'test';
var stream =  require('../lib/members-loader');
var assert = require('assert');
var db = require('../lib/db');
var fs = require('fs');

describe("members-loader", function(){

  beforeEach(function(done){
    var query = fs.readFileSync(__dirname + '/fixtures/member.sql').toString();
    var member = {
      "member_id":"628","house":"1","first_name":"Harry","last_name":"Jenkins",
      "constituency":"Scullin","party":"Australian Labor Party",
      "entered_house":"2011-11-24","left_house":"9999-12-31",
      "entered_reason":"changed_party","left_reason":"still_in_office",
      "person_id":"10335","title":"","lastupdate":"2012-06-24 14:33:49",
      "full_name":"Harry Jenkins","name":"Harry Jenkins",
      "image":"/images/mpsL/10335.jpg", "history": []
    };
    db.query(query, function(err){    
      assert(!err);
      stream.on('end', done);
      stream.write(member);
      stream.write(member); // write twice to test update
      stream.end();
    });
  });

  it("should upsert any data to the database", function(done){
    var query = 'select * from member where member_id = $1';
    db.query(query, [628], function(err, result){    
      assert(!err);
      assert.equal(result.rowCount, 1);
      assert.equal(result.rows[0].first_name, 'Harry');
      db.end();
      done();
    });
  });

});
