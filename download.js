var colors = require('colors');
var OpenAu = require('./lib/openau-checker');
var downloader = require('./lib/xml-downloader');
var Hansard = require('./lib/hansard');
require('date-utils');

var argv = require('optimist')
  .usage('Usage: $0 -u [url] -d [date]')
  .demand(['u'])
  .alias('u', 'url')
  .alias('d', 'date')
  .describe('u', 'URL to download OpenAustralia xml files from')
  .describe('d', 'Date to get hansard scripts after. In format 2012-12-01')
  .argv;

function workOutDateToRequest(cb){
  if (argv.date){
    cb(null, (new Date(argv.date)).addDays(-1));
  }else{
    Hansard.lastSpeechDate(function(err, date){
      if (!date) cb('No recent date in database. Run with -d instead');
      cb(null, date);
    });
  }
}

workOutDateToRequest(function(err, date){
  if (err) return console.error(err.red);
  var openau = new OpenAu(argv.url, date);
  var parser = new Hansard.Parser();

  openau
    .pipe(downloader)
    .pipe(parser)
    .on('end', function(){
      Hansard.end();
      console.error('ok'.green);
    });
});

