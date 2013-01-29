exports.send = function(req, res, results){
  var output; 
  if (req.query.callback){
    output = (typeof results === 'string') ? results : JSON.stringify(results);
    res.send(req.query.callback + "(" + output + ");");
  }else{
    output = (typeof results === 'string') ? JSON.parse(results) : results;
    res.json(output);
  }
};
