#!/usr/bin/env node
var sys = require('sys');
var nl = require('nodeload');
var _ = require('lodash');
var request = require('request');
var server = 'staging-partylines-api.theglobalmail.org';
//var server = 'localhost:8080';
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
  'murray darling basin',
  'trade agreement',
  'foreign affairs',
  'indonesia',
  'party politics',
  'the',
  'transit police',
  'federal funding',
  'new south wales'
];

var hansardIds = ['senate-2010-05-11.95.1', 'senate-2010-05-11.96.2', 'senate-2010-05-12.151.1', 'senate-2010-05-12.151.18', 'senate-2010-05-12.152.1', 'senate-2010-05-12.105.3', 'senate-2010-05-12.109.3', 'senate-2010-05-12.111.1', 'senate-2010-05-12.154.1', 'senate-2010-05-13.86.1', 'house-2010-05-11.22.18', 'house-2010-05-11.22.3', 'house-2010-05-11.22.31', 'house-2010-05-11.22.40', 'senate-2010-05-11.22.9', 'senate-2010-05-11.65.1', 'house-2010-05-12.31.1', 'senate-2010-05-12.106.1', 'senate-2010-05-13.139.21', 'senate-2010-05-13.90.1', 'house-2010-05-11.22.42', 'senate-2010-05-12.51.1', 'senate-2010-05-12.52.1', 'senate-2010-05-12.53.1', 'senate-2010-05-12.53.20', 'senate-2010-05-12.54.25', 'senate-2010-05-12.54.37', 'senate-2010-05-12.54.9', 'senate-2010-05-13.87.1', 'senate-2010-05-13.88.1', 'house-2010-05-12.95.1', 'senate-2010-05-12.150.1', 'senate-2010-05-13.160.9', 'senate-2010-05-12.53.19', 'senate-2010-05-13.89.1', 'house-2010-05-12.176.1', 'house-2010-05-13.19.1', 'house-2010-05-11.22.2', 'senate-2010-05-12.153.1', 'senate-2010-05-12.54.1', 'house-2010-05-13.43.1', 'senate-2010-05-13.164.1', 'senate-2010-05-12.55.15', 'senate-2010-05-12.55.17', 'senate-2010-05-12.55.5', 'senate-2010-05-12.62.1', 
    'senate-2009-09-15.65.1', 'senate-2009-09-15.64.1', 'senate-2009-09-14.12.4', 'senate-2009-09-14.14.8', 'senate-2009-09-14.30.1', 'senate-2009-09-14.32.5', 'senate-2009-09-15.67.1', 'senate-2009-09-15.97.2', 'house-2009-09-16.76.22', 'house-2009-09-17.15.1', 'house-2009-09-17.21.1', 'senate-2009-09-17.121.3', 'senate-2009-09-17.173.14', 'senate-2009-09-15.66.1', 'senate-2009-09-14.14.10', 'senate-2009-09-14.14.2', 'senate-2009-09-14.29.3', 'senate-2009-09-14.31.1', 'senate-2009-09-15.63.1', 'senate-2009-09-15.68.1', 'house-2009-09-16.76.2', 'house-2009-09-16.84.5', 'house-2009-09-17.16.1', 'house-2009-09-17.22.1', 'house-2009-09-16.143.1', 'senate-2009-09-17.121.13', 'senate-2009-09-14.33.1', 'senate-2009-09-14.33.3', 'senate-2009-09-16.65.2', 'senate-2009-09-16.65.7', 'senate-2009-09-14.12.12', 'senate-2009-09-14.12.3', 'senate-2009-09-14.12.8', 'senate-2009-09-14.14.19', 'senate-2009-09-14.96.1', 'senate-2009-09-15.68.8', 'house-2009-09-16.115.1', 'senate-2009-09-17.121.2'];

function wordchoiceApi(cb, client){
  var loadWordchoicesTerm = Math.floor(Math.random()*2);
  if (loadWordchoicesTerm){
    chooseRandomWordAndHitApi(cb, client);
  }else{
    loadHansards(cb, client);
  }
}

function chooseRandomWordAndHitApi(cb, client){
  var rand = Math.floor(Math.random()*words.length);
  var exact = Math.floor(Math.random()*2);
  var word = words[rand];
  var url = 'http://' + server + "/api/wordchoices/term/" + word;
  if (exact){
    url += '?c=1';
  }
  req = request({method: 'GET', url: url}, function(err, res, body){
    console.error(url.replace('http://' + server, '') + ": " + !!res.headers['x-cache'] + ' app cache: ' + !!res.headers['x-cached-wordchoice'] + ' and ' + res.headers['x-response-time']);
    cb({req: req, res: res});
  });
}

function loadHansards(cb, client){
  var rand = Math.floor(Math.random()*hansardIds.length) + 20;
  if (rand > 50) rand = 50;
  var shuffledIds = _.shuffle(hansardIds).slice(0, rand);
  var url = 'http://' + server + '/api/hansards?ids=' + shuffledIds.join(',');
  req = request({method: 'GET', url: url}, function(err, res, body){
    console.error(url.replace('http://' + server, '') + ": " + !!res.headers['x-cache'] + ' app cache: ' + !!res.headers['x-cached-wordchoice'] + ' and ' + res.headers['x-response-time']);
    cb({req: req, res: res});
  });
}

writes = {
  name: "/api/wordchoices/term load test",
  host: server,
  port: 80,
  numUsers: 500,
  timeLimit: (60 * 2),
  targetRps: 2,
  reportInterval: 2,
  stats: ['result-codes', 'latency', 'concurrency', 'uniques', { name: 'http-errors', successCodes: [200], log: 'http-errors.log' }],
  requestLoop: wordchoiceApi 
};

nl.run(writes);
