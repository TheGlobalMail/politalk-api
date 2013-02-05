#!/usr/bin/env node
var sys = require('sys');
var nl = require('nodeload');
var request = require('request');
var server = 'politalk-api.theglobalmail.org';
var writes;
var util = require('util');

console.log("Running test on " + server);

function membersApi(cb, client){
  var pad = '00';
  var rand = Math.floor((Math.random()*7)+1).toString();
  var url = 'http://' + server + "/api/members/year?";
  url += 'from=20' + pad.substring(0, pad.length - rand.length) + rand + '-01-01&';
  url += 'callback=test';
  
  req = request({method: 'GET', url: url}, function(err, res, body){
    console.error(url.replace('http://' + server, '') + ": " + !!res.headers['x-cache'] + ' app cache: ' + !!res.headers['x-cached-endpoint'] + ' and ' + res.headers['x-response-time']);
    //console.error(url.replace('http://' + server, '') + ": " + util.inspect(req.headers))
    cb({req: req, res: res});
  });
}

writes = {
  name: "/api/members load test",
  host: server,
  port: 80,
  numUsers: 4,
  timeLimit: (60 * 2),
  targetRps: 2,
  reportInterval: 2,
  stats: ['result-codes', 'latency', 'concurrency', 'uniques', { name: 'http-errors', successCodes: [200], log: 'http-errors.log' }],
  requestLoop: membersApi 
};

nl.run(writes);
