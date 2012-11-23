var metrics = require('./lib/metrics');
var colors = require('colors');
var Checker = require('./lib/openau-checker');
var downloader = require('./lib/xml-downloader');
var Hansard = require('./lib/hansard');
var MembersStream = require('./lib/members').MembersStream;
var membersLoader = require('./lib/members-loader');
require('date-utils');

var argv = require('optimist')
  .usage('Usage: $0 -u [url] -f [from] -t [to]')
  .demand(['u'])
  .alias('u', 'url')
  .describe('u', 'URL to download OpenAustralia xml files from')
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
      cb(null, date);
    });
  }
}

workOutDateToRequest(function(err, date){
  if (err) return console.error(err.red);

  var checker = new Checker(argv.url, date, argv.to && new Date(argv.to));
  var parser = new Hansard.Parser();
  var members = new MembersStream({ url: argv.url, apikey: process.env.OPENAU_KEY });

  async.parallel([

    function(cb){
      // Steam member data into database
      members.pipe(membersLoader).on('end', cb);
    }

    /*
    function(cb){
      // Steam handard data into database
      checker
        .pipe(downloader)
        .pipe(parser)
        .on('end', function(){
          console.error('ok'.green);
        });
    }*/

  ], function(err){
    Hansard.end();
    console.error('ok'.green);
  });
});

