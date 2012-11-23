var OpenAuChecker = require('./lib/openau-checker');
var db = require('./lib/db');
var es = require('event-stream');
var JSONStream = require('JSONStream');
var moment = require('moment');
var rimraf = require('rimraf');
var argv = require('optimist')
  .usage('Usage: $0 -u [url] -m -d [date]')
  .demand(['u'])
  .alias('u', 'url')
  .describe('u', 'URL to download OpenAustralia xml files from')
  .alias('d', 'date')
  .describe('d', 'Only show dates after this date')
  .argv;

var cacheDir = '/Users/bjrossiter/git/openaustralia/html_cache/';

var checker = new OpenAuChecker(argv.url, new Date(argv.date || '2006-02-06'));

var verify = es.map(function(data, cb){
  var stream = this;
  var house = data.url.match(/\/([^\/]*?)\/20/)[1].match(/senate/) ? 2 : 1;
  var query = 'select 1 from hansards inner join member on member.member_id = hansards.speaker_id where date = $1 and member.house = $2 limit 1';
  var params = [data.date, house];
  data.house = house === 2 ? 'senate' : 'house';
  db.query(query, params, function(err, result){
    // emit data if not found
    if (err) return cb(err);
    return result && result.rowCount ? cb() : cb(null, data);
  });
});

var cachedClear = es.map(function(data, cb){
  var cached = cacheDir + moment(data.date).format('YYYY-MM-DD');
  rimraf(cached, function(err){
    cb(err, data);
  });
});

var reporter = es.through(function(data){
  console.error("Missing " + data.house + " for " + data.date);
  this.emit(data);
});

checker
  .pipe(verify)
  .pipe(cachedClear)
  .pipe(reporter)
  .on('end', function(){
    db.end();  
    console.error('ok');
  });
