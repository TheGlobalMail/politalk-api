var _ = require('lodash');
var natural = require('natural');
var TfIdf = natural.TfIdf;
var NGrams = natural.NGrams;
var _str = require('underscore.string');
var fs = require('fs');

// Extract the most frequently used phrases from the html. 2, 3 and 4 length
// phrases are measured and then combined to remove redundancy. Black and
// whitelists are also applied.
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
  
  // Combine results from each ngram to remove redundancy
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

// Attempt to combine the results for different ngrams in order to work out
// whether we should use "national broadband network", rather than "national
// broadband" and "broadband network". In this example with a cutoff of .2,
// if the longer phrase (ngram of 3) was used 20 times, and "broadband network"
// was used 22 times (within the cutoff of 20 * 0.2), then it would be removed
// from the results. If "national broadband" was used more than the cutoff,
// e.g. 30 times, it would be left in the results.
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

// Monkey patch TfIdf to return the most frequent terms
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

blacklist = fs.readFileSync(__dirname + '/stopwords.txt').toString().split('\n');

exports.whitelisted = function(term){
  return exports.whitelist[term];
};

exports.blacklisted = function(term){
  if (term.match(/^\d+$/) || term.match(/^_/)){
    return true;
  }
  return _.indexOf(blacklist, term) !== -1;
}
