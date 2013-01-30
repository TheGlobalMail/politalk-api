var clusters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var db = require('./lib/db');
var moment = require('moment');
var fs = require('fs');
var async = require('async');

async.forEachSeries(clusters, function(cluster, done){
  if (cluster === 'a' || cluster === 'b' || cluster === 'e'){
    return done();
  }
  var query = fs.readFileSync(__dirname + '/misc/example_manual_cluster.sql').toString();
  var start = new Date();
  query = query.replace(/LETTER/gm, cluster);
  query = query.replace(/CONDITION/gm, cluster + '%');
  console.error("Starting " + cluster);

  db.query(query, function(err){
    var end = new Date();
    var duration = moment.duration(end.getTime() - start.getTime()).humanize();
    console.error("Completed " + cluster + " in " + duration);
    done();
  });
}, function(err){
  db.end();
  if (err) return console.error("ERROR: " + err);
});
