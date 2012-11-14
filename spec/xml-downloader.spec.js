var downloader = require('../lib/xml-downloader');
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

describe("xml-downloader", function(){

  var server;

  beforeEach(function(done){
    server = http.createServer(app).listen(port, done);
  });

  afterEach(function(done){
    server.close(done);
  });

  describe("reading from a stream that emits data with the keys date and url", function(){
    
    it("should emit data with the date and the xml downloaded from the url", function(done){
      var date = new Date(2011, 10, 1);
      var url = 'http://localhost:22250/senate_debates/2012-10-30.xml';
      var called = 0;
      downloader.on('data', function(data){
        assert(data.date.toString(), '2012-10-30');
        assert(data.xml.match(/speech/), 'XML data should contain a speech tag');
        called += 1;
      });
      downloader.on('error', done);
      downloader.on('end', function(){
        assert.equal(called, 1);
        done();
      });
      downloader.write({date: date, url: url});
      downloader.end();
    });

  });
});
