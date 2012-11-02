var keywords = require('../lib/keywords');
var assert = require('assert');
var expect = require('expect.js');
var _ = require('lodash');

describe("keywords", function(){
  
  describe('.extract', function(){

    it("should extract keywords from html", function(){
      var results = keywords.extract("bridger john said this. Bridger john said that.");
      assert.equal(results[0].term, 'bridger john');
      assert.equal(results[0].tf, 2);
    });

  });

  describe('.combine', function(){

    describe('passed a larger phrase that is the composition of smaller phrases', function(){

      var phrases = { 'compile': 110, 'c': 100, 'compile c': 105 };

      it("should remove the sub phrases", function(){
        expect(keywords.combine(phrases)).to.eql({'compile c': 105});
      });

      describe("with a cutoff", function(){

        var phrases = {
          'carbon price': 76,
          'tonne carbon price': 22,
          'carbon price equivalent': 21,
          'tonne carbon price equivalent': 21
        };

        it("should remove sub phrases if all scores are within the cutoff", function(){
          expect(keywords.combine(phrases, 0.2)).to.eql({
            'carbon price': 76,
            'tonne carbon price equivalent' : 21
          });
        });

      });
    
    });
  });
});
