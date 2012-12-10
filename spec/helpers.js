var db = require('../lib/db');
var fs = require('fs');
var Hansard = require('../lib/hansard');

var testsRunning = 0;
var port = 8085;
exports.server = null;

exports.startApp = function(app, cb){
  if (!testsRunning){
    exports.server = app.listen(port, cb);
    testsRunning++;
  }else{
    cb();
  }
};

exports.url = 'http://localhost:' + port;

exports.stopApp = function(cb){
  testsRunning--;
  if (!testsRunning){
    db.end();
    exports.server.close(cb);
  }else{
    cb();
  }
};

exports.clearHansard = function(cb){
  var query = fs.readFileSync(__dirname + '/fixtures/hansards.sql').toString();
  db.query(query, cb);
};

exports.clearMembers = function(cb){
  var query = fs.readFileSync(__dirname + '/fixtures/member.sql').toString();
  db.query(query, cb);
};

exports.calculateMemberSummaries = function(cb){
  var query = fs.readFileSync(__dirname + '/../db/member_summaries.sql').toString();
  db.query(query, cb);
};

exports.loadHansard = function(cb){
  var speech = {
    id: 'test', date: new Date('2012-10-10'), 
    html: '', headingId: 1, subHeadingId: 1, 
    duration: 600,
    speaker_id: 265, speaker: 'John Howard', timeOfDay: '11:00'
  };
  Hansard.addSpeech(speech, cb);
};

exports.calculateSummary = function(cb){
  var query = fs.readFileSync(__dirname + '/../db/summary.sql').toString();
  db.query(query, cb);
};

exports.cleanup = function(){
  db.end();
};
