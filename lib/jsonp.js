exports.send = function(req, res, results){
  var output = (typeof results === 'string') ? JSON.parse(results) : results;
  if (req.query.callback){
    res.jsonp(output);
  }else{
    res.json(output);
  }
};
