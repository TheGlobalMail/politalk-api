var db = require('./db');
var _ = require('lodash');
var dateUtils = require('date-utils');

var defaultTo = Date.today();
var defaultFrom = new Date('2006-01-01');

exports.getFrom = function(param){
  var fromParam = new Date(param);
  return !param || isNaN(fromParam.valueOf()) ? defaultFrom : fromParam;
};

exports.getTo = function(param){
  var toParam = new Date(param);
  return !param || isNaN(toParam.valueOf()) ? defaultTo : toParam;
};

exports.find = function(cb){
  var query = "select date from hansards group by date order by date";
  db.query(query, function(err, result) {
    if (err) return cb(err);
    cb(null, _.pluck(result.rows, 'date'));
  });
};

exports.formatWeek = function(week, year){
  return 'W' + week + '-' + year;
};

exports.weeks = function(cb){
  var query = "SELECT extract(year from date) AS year, extract(week from date) as week from hansards group by 1,2 order by 1,2";
  db.query(query, function(err, result) {
    if (err) return cb(err);
    var weeks = _.map(result.rows, function(row){
      return exports.formatWeek(row.week, row.year);
    });
    cb(null, weeks);
  });
};
