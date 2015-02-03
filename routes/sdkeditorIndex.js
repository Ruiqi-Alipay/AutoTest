var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('sdkeditorIndex', { title: 'Express' });
});

module.exports = router;

var mongoose = require('mongoose');
var Script = mongoose.model('Script');
var ScriptsFolder = mongoose.model('ScriptsFolder')

router.get('/api/scripts', function(req, res, next) {
  if (req.query && req.query.id) {
    var query = Script.findById(req.query.id);
    query.exec(function (err, script){
      if (err) { return next(err); }
      res.json(script);
    });
  } else {
    Script.find({}, {title: 1, date: 1, folder: 1}, function(err, scripts){
      if(err){ return next(err); }

      res.json(scripts);
    });
  }
});

router.post('/api/scripts', function(req, res, next) {
    req.body.date = new Date();
    if (req.body._id) {
      var query = Script.findById(req.body._id);
      query.exec(function (err, script){
        if (err) { return next(err); }
        if (!script) { return next(new Error("can't find script")); }
        script.title = req.body.title;
        script.content = req.body.content;
        script.date = req.body.date;
        script.folder = req.body.folder;

        script.save(function(err, script){
          if(err){ return next(err); }
          res.json(script);
        });
      });
    } else {
      var script = new Script(req.body);
      script.save(function(err, script){
        if(err){ return next(err); }
        res.json(script);
      });
    }
});

router.param('script', function(req, res, next, id) {
  var query = Script.findById(id);

  query.exec(function (err, script){
    if (err) { return next(err); }
    if (!script) { return next(new Error("can't find script")); }

    req.script = script;
    return next();
  });
});

router.get('/api/scripts/:script', function(req, res) {
  res.json(req.script);
});

router.put('/api/scripts/:script/download', function(req, res, next) {
  req.script.download(function(err, script){
    if (err) { return next(err); }

    res.json(script);
  });
});

router.delete('/api/scripts/:script', function(req, res) {
  req.script.remove(function(err, script){
    if (err) { return next(err); }

    res.json(script);
  });
});


/* Script Folder */
router.get('/api/scriptsfolder', function(req, res, next) {
  ScriptsFolder.find(function(err, folders){
    if(err){ return next(err); }

    res.json(folders);
  });
});

router.post('/api/scriptsfolder', function(req, res, next) {
  if (req.body._id) {
    var query = ScriptsFolder.findById(req.body._id);
    query.exec(function (err, folder){
      if (err) { return next(err); }
      if (!folder) { return next(new Error("can't find folder")); }
      folder.title = req.body.title;

      folder.save(function(err, folder){
        if(err){ return next(err); }
        res.json(folder);
      });
    });
  } else {
    var folder = new ScriptsFolder(req.body);

    folder.save(function(err, folder){
      if(err){ return next(err); }
      res.json(folder);
    });
  }
});

router.param('scriptsfolder', function(req, res, next, id) {
  var query = ScriptsFolder.findById(id);

  query.exec(function (err, folder){
    if (err) { return next(err); }
    if (!folder) { return next(new Error("can't find folder")); }

    req.scriptsfolder = folder;
    return next();
  });
});

router.delete('/api/scriptsfolder/:scriptsfolder', function(req, res) {
  req.scriptsfolder.remove(function(err, folder){
    if (err) { return next(err); }

    res.json(folder);
  });
});
