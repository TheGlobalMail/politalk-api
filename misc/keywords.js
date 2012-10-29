var _ = require('lodash');
var natural = require('natural')
var NGrams = natural.NGrams;

exports.whitelist = {
  'new south wales': true,
  'australian capital territory': true
};

exports.whitelisted = function(term){
  return exports.whitelist[term];
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












// Merge all results for each ngram and then sort by score
/*
exports.combine = function(ngrams, scoreOn, cutoff){
  if (!ngrams) ngrams = _.range(results.length);
  if (!scoreOn) scoreOn = 'tf';
  if (!cutoff) cutoff = 40;
  return _.chain(ngrams)
    .values()
    .flatten()
    .sortBy(function(item){ return item[scoreOn]; })
    .reverse()
    .slice(0, 40)
    .value();
};
*/

// Merge all results for each ngram and then sort by score
/*
exports.amalgatmate = function(ngrams, scoreOn, cutoff){
  var largestNgram = _.chain(ngrams)
    .keys()
    .sort()
    .last()
    .value();
  var amalgatmated = [];
  exports.amalgatmateNgram(amalgatmated, ngrams, largestNgram);
  return amalgatmated;
};
*/

exports.amalgatmateNgram = function(amalgatmated, ngrams, ngram){
  var results = ngrams[ngram];
  _.each(results, function(result){
    exports.removeLesserNgramsFromResults(amalgatmated, ngrams, ngram, result);
  });
  return amalgatmated;
};

exports.removeLesserNgramsFromResults = function(amalgatmated, ngrams, ngram, result){
  //var ngramsOfResult = NGrams.ngrams(result, ngram - 1);
  //var ngramsOfResultAreNotSpecial = _.all(ngramsOfResult,
};

// ngrams.last.each(checkForComposition(item, ngramCount, ngrams))
exports.checkForComposition = function(item, ngramCount, results){
  // ngrams = ngram using ngramCount - 1
  // isComposed = _.all(ngrams, 
  //  results(ngramCount - 1).include?(ngram) && 
  //  results(ngramCount - 1).score < ( score  + score * backoff)
}
