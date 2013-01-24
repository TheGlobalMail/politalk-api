var glob = require('glob');
var exec = require('child_process').exec;
var async = require('async');
var moment = require('moment');
var _ = require('lodash');

var options  = {};

glob("*.csv", options, function (err, files){
  files = _.select(files, function(file){
    return file.match(/(2009|2010|2011|2012)/);
  });
  async.forEachSeries(files, function(file, done){
    var start = new Date();
    var path = __dirname + '/' + file;
    var command = 'echo "COPY wordchoice_tokens(word1,token1,word2,token2,word3,token3,date,party,hansard_id) FROM \'' + path + '\' DELIMITERS \',\' CSV;" | psql -h localhost politalk';
    //console.error(command);
    exec(command, function(err){
      if (err) return done(err);
      var end = new Date();
      var duration = moment.duration(end.getTime() - start.getTime()).humanize();
      console.error("Completed " + file + " in " + duration);
      done();
    });
  }, function(err){
    if (err) return console.error(err);
    console.error('OK');
  });
});
