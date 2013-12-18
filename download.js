var async = require('async');
var moment = require('moment');
var metrics = require('./lib/metrics');
var OpenAuChecker = require('./lib/openau-checker');
var downloader = require('./lib/xml-downloader');
var Hansard = require('./lib/hansard');
var filterDownloaded = Hansard.filterDownloadedStream();
var keywords = require('./lib/keywords');
var Members = require('./lib/members');
var MembersStream = Members.MembersStream;
var membersLoader = require('./lib/members-loader');
var verifyMemberImages = require('./lib/verify-member-images');
var query = require('./lib/query');
var wordchoices = require('./lib/wordchoices');
var cache = require('./lib/cache');
require('date-utils');
var start = new Date();

var argv = require('optimist')
  .usage('Usage: $0 -u [url] -f [from] -t [to]')
  .alias('u', 'url')
  .describe('u', 'URL to download OpenAustralia xml files from')
  .alias('k', 'key')
  .describe('k', 'OpenAustralia API key')
  .alias('h', 'house')
  .describe('h', 'House to get data for. Either "representatives" or "senate"')
  .alias('f', 'from')
  .describe('f', 'Date to get hansard scripts after. In format 2012-12-01')
  .alias('t', 'to')
  .describe('t', 'Date to get hansard scripts before. In format 2012-12-01')
  .argv;

var url = argv.url || 'http://data.openaustralia.org/scrapedxml';
var from = argv.from && new Date(argv.from);
var to = argv.to && new Date(argv.to);
var parser = new Hansard.Parser({ metadata: true });
var apikey = argv.key || process.env.OPENAU_KEY;

async.series([

  /*
   * TODO: 
   * 1) fix it so that the member loader does not overwrite image field
   * 2) that images are only requested if not requested before?
  function(cb){
    // Stream member data into database
    var members = new MembersStream({ apikey: apikey });
    members
      .pipe(membersLoader)
      .on('end', cb);
  },

  function(cb){
    // Verify all member images
    Members.createStream(function(err, members){
      if (err) return cb(err);
      members
        .pipe(verifyMemberImages)
        .pipe(membersLoader)
        .on('end', cb);
    });
  },
  */

  function(cb){
    // Stream handard data into database and regenerate keyword and 
    // member summary tables
    var openAuChecker = new OpenAuChecker(url, {after: from, before: to, house: argv.house});
    console.error("DOWNLOADER: start");
    console.error("DOWNLOADER: ENABLE_WORDCHOICES=" + !!process.env.ENABLE_WORDCHOICES);
    if (process.env.ENABLE_WORDCHOICES){
      openAuChecker
        .pipe(filterDownloaded)
        .pipe(downloader)
        .pipe(parser)
        .pipe(query.createStream('db/phrases_summaries.sql'))
        .pipe(query.createStream('db/member_summaries.sql'))
        .pipe(cache.rebuildMembersCache())
        .pipe(wordchoices.createIndexStream())
        .pipe(keywords.generateListsStream())
        .pipe(cache.rebuildStream())
        .pipe(cache.rebuildCacheStream())
        .pipe(query.createStream('db/vacuum.sql'))
        .pipe(query.createStream('db/analyze.sql'))
        .on('end', cb)
        .on('error', function(err){ cb(err); });
    }else{
      console.error('openau')
      openAuChecker
        .pipe(filterDownloaded)
        /*.pipe(downloader)
        .pipe(parser)
        .pipe(query.createStream('db/phrases_summaries.sql'))
        .pipe(query.createStream('db/member_summaries.sql'))
        .pipe(cache.rebuildStream())
        .pipe(cache.rebuildMembersCache())*/
        .on('end', cb)
        .on('error', function(err){ cb(err); });
    }
  }

], function(err){
  Hansard.end();
  metrics.end(function(){
    var end = new Date();
    var duration = moment.duration(end.getTime() - start.getTime()).humanize();
    console.error("DOWNLOADER: end: " + duration);
    if (err){
      console.error("DOWNLOADER: " + err);
      process.exit(1);
    }else{
      console.error('DOWNLOADER: OK');
      process.exit(0);
    }
  });
});

