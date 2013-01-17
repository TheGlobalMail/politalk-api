var db = require('./lib/db');
var csv = require('csv');
var util = require('util');
var moment = require('moment');
var _ = require('lodash');
var async = require('async');
var dates = require('./lib/dates');

function key(keyword, party){
  return keyword + ' - ' + party;
}

var comparisons = [
  [
    'asylum seeker',
    'boat people',
    'illegals',
    'refugee'
  ],
  [
    'carbon tax',
    'clean energy future package',
    'carbon pric',
    'emissions trad',
    'tax on pollution',
    'tax on big pollutors'
  ],
  [
    'economic mismanagement',
    'spreading the benefits'
  ]
];

var parties = [
  'Australian Democrats',
  'Australian Greens',
  'Australian Labor Party',
  //'Country Liberal Party',
  'Independent',
  'Liberal Party',
  //'National Country Party',
  'National Party'
];

async.forEach(comparisons, function(keywords, comparisonComplete){

  var columns = ['date'];
  columns = columns.concat(
    _.flatten(
      _.map(keywords, function(keyword){
        return _.map(parties, function(party){
          return key(keyword, party);
        });
      })
    )
  );

  var csvWriter = csv().to.path(__dirname+'/data/' + keywords[0].replace(/ /g, '_') + '_week.csv', {columns: columns});

  csvWriter.on('end', function(){
    comparisonComplete();
  });

  csvWriter.write(_.object(columns, columns));

  dates.weeks(function(err, dates){ 

    async.forEach(dates, function(date, done){
      
      var datum = {date: 'W' + date.week + '-' + date.year};
      async.forEach(keywords, function(keyword, done){
        async.forEach(parties, function(party, done){
         //console.error('Doing ' + key(keyword, party));
          var query = "select string_agg(html, ' ') as html from hansards " +
            "inner join member on member.member_id = hansards.speaker_id " +
            "where html ~* $1 and extract(year from date) = $2 and extract(week from date) = $3 and party = $4 group by party, date;";
          db.query(query, [keyword, date.year, date.week, party], function(err, result){
            if (err) return done(err);
            var count = result.rowCount && result.rows[0].html.match(new RegExp(keyword, "igm"));
            datum[key(keyword, party)] = count ? count.length : 0;
            //console.error(key(keyword, party) + ": " + (count ? count.length : 0));
            done();
          });
        }, done);
      }, function(err){
        if (err) return done(err);
        //console.error("writing out:");
        //console.error(util.inspect(datum));
        csvWriter.write(datum);
        done();
      });
    }, function(err){ 
      csvWriter.end();
    });
  });
  
}, function(err){
  db.end();
  console.error(err ? err : 'OK');
});
