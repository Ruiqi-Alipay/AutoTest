var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var mongoose = require('mongoose');
var TestScript = mongoose.model('TestScript');

router.get('/api/scripts', function(req, res, next) {
  TestScript.find(function(err, scripts){
    if(err){ return next(err); }

    res.json(scripts);
  });
});

router.post('/api/script', function(req, res, next) {
  var script = new TestScript(req.body);

  script.save(function(err, script){
    if(err){ return next(err); }

    res.json(script);
  });
});

router.param('script', function(req, res, next, id) {
  var query = TestScript.findById(id);

  query.exec(function (err, script){
    if (err) { return next(err); }
    if (!script) { return next(new Error("can't find script")); }

    req.script = script;
    return next();
  });
});

router.get('/api/scripts/:script', function(req, res) {
  res.json(req.post);
});

router.put('/api/scripts/:script/download', function(req, res, next) {
  req.script.download(function(err, script){
    if (err) { return next(err); }

    res.json(script);
  });
});
