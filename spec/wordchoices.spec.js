process.env.NODE_ENV = 'test';
var stream =  require('../lib/members-loader');
var assert = require('assert');
var db = require('../lib/db');
var async = require('async');
var _ = require('lodash');
var helpers = require('./helpers');
var fs = require('fs');
var wordchoices = require('../lib/wordchoices');
var columns = ['word1', 'token1', 'word2', 'token2', 'word3', 'token3', 'date', 'party', 'hansard_id'];

describe("wordchoices.createIndexStream", function(){

  var hansardRecord;

  beforeEach(function(done){
    async.series([
      helpers.loadSchema,
      helpers.loadMemberFixture,
      helpers.loadHansardFixtures,
      function(done){
        db.query('select * from hansards where id = $1', ['test'], function(err, result){
          if (err) return done(err);
          hansardRecord = result.rows[0];
          done();
        });
      }
    ], done);
  });

  describe("reading from a stream with objects of hansard data", function(){

    it("should index records for each word in the hansard text", function(done){
      var stream = wordchoices.createIndexStream(); 
      stream.on('end', function(){
        var query = 'select * from wordchoice_tokens where hansard_id = $1';
        db.query(query, [hansardRecord.id], function(err, result){
          var words = hansardRecord.stripped_html.split(' ');
          words = _.reject(words, function(word){
            return word === 'and' || !word;
          });
          assert.equal(words.length, result.rowCount);
          var indexRow = result.rows[0];
          assert.equal(words[0], indexRow.word1);
          assert.equal(words[1], indexRow.word2);
          assert.equal('and', indexRow.word3);
          assert.equal(hansardRecord.party, indexRow.party);
          assert.equal('2012-41', indexRow.week);
          db.end();
          done();
        });
      });
      stream.write(hansardRecord);
      stream.end();
    });

  });
});
