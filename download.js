var colors = require('colors');
var dateUtils = require('date-utils');

var OpenAu = require('./lib/openau').OpenAu;
var Hansard = require('./lib/hansard');

var argv = require('optimist')
  .usage('Usage: $0 -u [url] -d [date]')
  .demand(['u'])
  .alias('u', 'url')
  .alias('d', 'date')
  .describe('u', 'URL to download OpenAustralia xml files from')
  .describe('d', 'Date to get hansard scripts after. In format 2012-12-01')
  .argv;

function startImport(){
  if (argv.date){
    grabFromOpenAustralia((new Date(argv.date)).addDays(-1), complete);
  }else{
    Hansard.lastSpeechDate(function(err, date){
      if (!date) complete('No recent date in database. Run with -d instead');
      grabFromOpenAustralia(date, complete);
    });
  }
};

function grabFromOpenAustralia(date, cb){
  var openau;
  console.info('Last download date: ' + date);
  console.info('URL: ' + argv.url);
  openau = new OpenAu(argv.url, date);
  openau.on('data', function(xml, debateOn){
    console.info('Looking at ' + debateOn);
    var parser = new Hansard.Parser(debateOn);
    parser.on('error', cb);
    parser.write(xml);
    parser.on('end', function(){
      console.info('completed: ' + debateOn);
    });
  });
  openau.on('error', cb);
  openau.on('end', cb);
};

function complete(err){
  if (err){
    throw(err);
    process.exit(1);
  }else{
    console.error('ok'.green);
  }
};

startImport();
