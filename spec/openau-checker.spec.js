var OpenAuChecker = require('../lib/openau-checker');
var express = require('express');
var assert = require('assert');
var http = require('http');
var sinon = require('sinon');
var app = express();
var port = 22250;
var url = 'http://localhost:' + port;
app.configure(function(){
  app.use(express.static(__dirname + '/fixtures'));
});

describe("OpenAuChecker", function(){

  var server;

  beforeEach(function(done){
    server = http.createServer(app).listen(port, done);
  });

  afterEach(function(done){
    server.close(done);
  });

  describe("with xml files available on the server after the date provided", function(){
    
    it("should emit data with the date and url for each xml file", function(done){
      var date = new Date(2011, 10, 1);
      var checker = new OpenAuChecker(url, date);
      var called = 0;
      checker.on('data', function(data){
        assert(data.date.toString(), '2012-10-30');
        assert(data.url.match(/2012-10-30.xml/));
        called += 1;
      });
      checker.on('error', done);
      checker.on('end', function(){
        assert.equal(called, 2);
        done();
      });
    });

  });

  describe("with no xml files available after the date provided", function(){

    it("should not emit any data", function(done){
      var date = new Date(2012, 10, 3);
      var checker = new OpenAuChecker(url, date);
      var callback = sinon.spy();
      checker.on('error', done);
      checker.on('data', callback);
      checker.on('end', function(){
        assert(!callback.called);
        done();
      });
    });

  });
});
