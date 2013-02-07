#!/usr/bin/env node
var sys = require('sys');
var nl = require('nodeload');
var request = require('request');
//var server = 'partylines-api.theglobalmail.org';
var server = 'localhost:8080';
var writes;
var util = require('util');

console.log("Running test on " + server);

var words = [
  'election',
  'elections',
  'community',
  'labor government',
  'women',
  'lie',
  'bicycle',
  'pay tv porn',
  'ms gillard',
  'asylum seekers',
  'carbon tax',
  'carbon price',
  'price on pollution',
  'tax',
  'climate change',
  'boat people',
  'illegals',
  'piss off',
  'mining',
  'murray darling basin'
];

function wordchoiceApi(cb, client){
  var rand = Math.floor(Math.random()*words.length);
  var exact = Math.floor(Math.random()*2);
  var word = words[rand];
  var url = 'http://' + server + "/api/wordchoices/term/" + word;
  url += '?callback=test';
  if (exact){
    url += '&c=1';
  }
  
  req = request({method: 'GET', url: url}, function(err, res, body){
    console.error(url.replace('http://' + server, '') + ": " + !!res.headers['x-cache'] + ' app cache: ' + !!res.headers['x-cached-wordchoice'] + ' and ' + res.headers['x-response-time']);
    //console.error(url.replace('http://' + server, '') + ": " + util.inspect(req.headers))
    cb({req: req, res: res});
  });
}

writes = {
  name: "/api/wordchoices/term load test",
  host: server,
  port: 80,
  numUsers: 40,
  timeLimit: (60 * 2),
  targetRps: 2,
  reportInterval: 2,
  stats: ['result-codes', 'latency', 'concurrency', 'uniques', { name: 'http-errors', successCodes: [200], log: 'http-errors.log' }],
  requestLoop: wordchoiceApi 
};

nl.run(writes);
