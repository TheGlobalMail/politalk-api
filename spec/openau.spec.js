var OpenAu = require('../lib/openau').OpenAu;
var express = require('express')
var assert = require('assert');
var http = require('http');
var sinon = require('sinon');
var app = express();
var port = 22250;
var url = 'http://localhost:' + port;
var suiteCount = 0;
app.configure(function(){
  app.use(express.static(__dirname + '/fixtures'));
});

describe("openau importer", function(){

  var server;

  beforeEach(function(done){
    server = http.createServer(app).listen(port, done);
  });

  afterEach(function(done){
    server.close(done);
  });

  describe("with xml files available after the date provided", function(){
    
    it("should emit data with the xml content for each xml file", function(done){
      var date = new Date(2011, 10, 1);
      var openau = new OpenAu(url, date);
      var called = 0;
      openau.on('data', function(xml, debateOn){
        assert.equal(debateOn.toString(), new Date('2012-10-30').toString());
        assert(xml.match(/speech/), 'XML data should contain a speech tag');
        called += 1;
      });
      openau.on('error', done);
      openau.on('end', function(){
        assert.equal(called, 2);
        done();
      });
    });

  });

  describe("with xml files available after the date provided", function(){

    it("should not emit any data", function(done){
      var date = new Date(2012, 10, 3);
      var openau = new OpenAu(url, date);
      var callback = sinon.spy();
      openau.on('error', done);
      openau.on('data', callback);
      openau.on('end', function(){
        assert(!callback.called);
        done();
      });
    });

  });
});
