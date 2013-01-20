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
    'refugee',
    'border security',
    'queue jumper',
    'stopping the boat'
  ],
  [
    'carbon tax',
    'clean energy future package',
    'carbon pric',
    'emissions trad',
    'climate change denier',
    'climate change sceptic'
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

  var csvWriter = csv().to.path(__dirname+'/data/' + keywords[0].replace(/ /g, '_') + '.csv', {columns: columns});

  csvWriter.on('end', function(){
    comparisonComplete();
  });

  csvWriter.write(_.object(columns, columns));

  dates.find(function(err, dates){ 

    async.forEach(dates, function(date, done){
      
      var datum = {date: moment(date).format('YYYY-MM-DD')};
      async.forEach(keywords, function(keyword, done){
        async.forEach(parties, function(party, done){
         //console.error('Doing ' + key(keyword, party));
          var query = "select string_agg(html, ' ') as html from hansards " +
            "inner join member on member.member_id = hansards.speaker_id " +
            "where html ~* $1 and date = $2 and party = $3 group by party, date;";
          db.query(query, [keyword, date, party], function(err, result){
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
