var metrics = require('./lib/metrics');
var Checker = require('./lib/openau-checker');
var downloader = require('./lib/xml-downloader');
var Hansard = require('./lib/hansard');
var async = require('async');
var MembersStream = require('./lib/members').MembersStream;
var membersLoader = require('./lib/members-loader');
var verifyMemberImages = require('./lib/verify-member-images');
var query = require('./lib/query');
var wordchoices = require('./lib/wordchoices');
var cache = require('./lib/cache');
require('date-utils');

var argv = require('optimist')
  .usage('Usage: $0 -u [url] -f [from] -t [to]')
  .alias('u', 'url')
  .describe('u', 'URL to download OpenAustralia xml files from')
  .alias('k', 'key')
  .describe('k', 'OpenAustralia API key')
  .alias('f', 'from')
  .describe('f', 'Date to get hansard scripts after. In format 2012-12-01')
  .alias('t', 'to')
  .describe('t', 'Date to get hansard scripts before. In format 2012-12-01')
  .argv;

function workOutDateToRequest(cb){
  if (argv.from){
    cb(null, new Date(argv.from));
  }else{
    Hansard.lastSpeechDate(function(err, date){
      if (!date) cb('No recent date in database. Run with -d instead');
      date.addDays(1);
      cb(null, date);
    });
  }
}

workOutDateToRequest(function(err, from){
  if (err) return console.error(err);

  var url = argv.url || 'http://data.openaustralia.org/scrapedxml';
  var to = argv.to && new Date(argv.to);
  var parser = new Hansard.Parser({ metadata: true });
  var apikey = argv.key || process.env.OPENAU_KEY;

  async.series([

    function(cb){
      // Stream member data into database
      var members = new MembersStream({ apikey: apikey });
      members
        .pipe(verifyMemberImages)
        .pipe(membersLoader)
        .on('end', cb);
    },

    function(cb){
      // Stream handard data into database and regenerate keyword and 
      // member summary tables
      var checker = new Checker(url, from, to);
      checker
        .pipe(downloader)
        .pipe(parser)
        .pipe(metrics.streamCounter('Sections downloaded'))
        .pipe(query.createStream('db/phrases_summaries.sql'))
        .pipe(query.createStream('db/member_summaries.sql'))
        .pipe(wordchoices.createIndexStream())
        .pipe(cache.rebuildStream())
        .pipe(cache.rebuildCacheStream())
        .pipe(cache.rebuildMembersCache())
        .pipe(query.createStream('db/vacuum.sql'))
        .pipe(query.createStream('db/analyze.sql'))
        .on('end', cb)
        .on('error', function(err){ cb(err); });
    }

  ], function(err){
    Hansard.end();
    metrics.end(function(){
      if (err){
        console.error(err);
        process.exit(1);
      }else{
        console.error('ok');
        process.exit(0);
      }
    });
  });
});

