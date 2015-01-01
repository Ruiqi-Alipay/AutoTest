var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var mongoose = require('mongoose');
var TestScript = mongoose.model('TestScript');

router.get('/api/testscript', function(req, res, next) {
  TestScript.find(function(err, scripts){
    if(err){ return next(err); }

    res.json(scripts);
  });
});

router.post('/api/testscript', function(req, res, next) {
  if (req.body._id) {
    var query = TestScript.findById(req.body._id);
    query.exec(function (err, script){
      if (err) { return next(err); }
      if (!script) { return next(new Error("can't find script")); }
      script.content = req.body.content;
      script.title = req.body.title;
      script.date = new Date();

      script.save(function(err, script){
        if(err){ return next(err); }
        res.json(script);
      });
    });
  } else {
    var script = new TestScript(req.body);

    script.save(function(err, script){
      if(err){ return next(err); }
      res.json(script);
    });
  }
});

router.param('testscript', function(req, res, next, id) {
  var query = TestScript.findById(id);

  query.exec(function (err, script){
    if (err) { return next(err); }
    if (!script) { return next(new Error("can't find script")); }

    req.testscript = script;
    return next();
  });
});

router.get('/api/testscript/:testscript', function(req, res) {
  res.json(req.testscript);
});

router.put('/api/testscript/:testscript/download', function(req, res, next) {
  req.testscript.download(function(err, script){
    if (err) { return next(err); }

    res.json(script);
  });
});

router.delete('/api/testscript/:testscript', function(req, res) {
  req.testscript.remove(function(err, script){
    if (err) { return next(err); }

    res.json(script);
  });
});
