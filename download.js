var colors = require('colors');
var OpenAu = require('./lib/openau-checker');
var downloader = require('./lib/xml-downloader');
var Hansard = require('./lib/hansard');
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
    cb(null, (new Date(argv.from)).addDays(-1));
  }else{
    Hansard.lastSpeechDate(function(err, date){
      if (!date) cb('No recent date in database. Run with -d instead');
      cb(null, date);
    });
  }
}

workOutDateToRequest(function(err, date){
  if (err) return console.error(err.red);

  var openau = new OpenAu(argv.url, date, argv.to);
  var parser = new Hansard.Parser();

  openau
    .pipe(downloader)
    .pipe(parser)
    .on('end', function(){
      Hansard.end();
      console.error('ok'.green);
    });
});

