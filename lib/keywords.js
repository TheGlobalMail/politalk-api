var _ = require('lodash');
var natural = require('natural'),
    TfIdf = natural.TfIdf;
var NGrams = natural.NGrams;
var _str = require('underscore.string');
var fs = require('fs');

TfIdf.prototype.listMostFrequestTerms = function(d) {
  var terms = [];
  for(term in this.documents[d]) {
    terms.push({term: term, tf: TfIdf.tf(term, this.documents[d])})
  }
  return terms.sort(function(x, y) { return y.tf - x.tf });
}

exports.whitelist = {
  'new south wales': true,
  'australian capital territory': true
};

var blacklist = [
  'madam',
  'no point',
  'project',
  'report',
  'australia',
  'question',
  'minister',
  'australian',
  'deputy',
  'reports',
  'legislation',
  'question',
  'bills',
  'yesterday',
  'legislastion',
  'document',
  'senator',
  'bill ',
  'afternoon',
  'resume',
  'government ',
  'federal',
  'question',
  '2012',
  'pty',
  'http',
  'ltd',
  'tabling',
  'special',
  'electorate'
];
blacklist = blacklist.concat(fs.readFileSync(__dirname + '/stopwords.txt').toString().split('\n'));

exports.whitelisted = function(term){
  return exports.whitelist[term];
};

exports.blacklisted = function(term){
  if (term.match(/^\d+$/) || term.match(/^_/)){
    return true;
  }
  return _.indexOf(blacklist, term) !== -1;
}

exports.extract = function(html){
  var text = _str.stripTags(html);
  var ngrams = [2, 3, 4]
  var results = [];
  var keywords = {};
  var combined, combinedResults = {};

  // For each ngram, extract the most frequent phrases (taking into account
  // black and while lists)
  _.each(ngrams, function(ngram){
    var keywordsForNgram;
    var tfidf = new TfIdf();
    var tokenized = _.map(NGrams.ngrams(text, ngram), function(ngram){
      return ngram.join(' ').toLowerCase();
    });
    tfidf.addDocument(tokenized);
    keywordsForNgram = tfidf.listMostFrequestTerms(0);
    keywordsForNgram = _.select(keywordsForNgram, function(item){
      return exports.whitelisted(item.term) || 
        !_.detect(item.term.split(' '), exports.blacklisted);
    });
    results = results.concat(keywordsForNgram);
  });

  // Convert results to a hash
  _.each(results, function(result){
    combinedResults[result.term] = result.tf;
  });
  
  // Combine keyword results intelligently
  combined = exports.combine(combinedResults, 0.5);
  
  // Convert to term: tf: format and sort
  combined = _.chain(combined) 
    .pairs()
    .sortBy(_.last)
    .reverse()
    .map(function(combination){ return {term: combination[0], tf: combination[1] }; })
    .value();

  return combined;
};

exports.combine = function(phrases, cutoff){
  var combined = _.clone(phrases);

  _.each(_.keys(phrases), function(phrase){
    var ngramToTry, subPhrases;
    ngramToTry = phrase.split(' ').length - 1;

    if (ngramToTry < 1) return;

    _.each(NGrams.ngrams(phrase, ngramToTry), function(ngram){
      var subPhrase = ngram.join(' ');
      if (phrases[subPhrase]){
        if (!cutoff || (phrases[phrase] / phrases[subPhrase]) >= (1 - cutoff)){
          delete combined[subPhrase];
        }
      }
    });
  });

  return combined;
};
