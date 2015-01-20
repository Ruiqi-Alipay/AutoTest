var express = require('express');
var fs = require('fs');
var targz = require('tar.gz');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('autotestIndex', { title: 'Express' });
});

module.exports = router;

var mongoose = require('mongoose');
var TestScript = mongoose.model('TestScript');
var TestReport = mongoose.model('TestReport');

/* Test Script */
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

/* Test Report */
router.post('/api/report', function(req, res) {
    var file = req.files.file;

    var compress = new targz().extract(file.path, './reports/' + file.name, function(err){
        if(err) {
          console.log(err);
          return next(err);
        }

        fs.readFile('./reports/' + file.name + '/performance.report', function(err, data) {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            var records = JSON.parse(data);
            records.forEach(function(value, index) {
              delete value['data'];
            });

            var report = new TestReport();
            report.title = file.name;
            report.content = JSON.stringify(records);
            report.save(function(err, report){
              if(err){
                console.log('Report save error: ' + err);
                return next(err);
              } else {
                res.json(report);
              }
            });
          }
        });
    });
});

router.param('testreport', function(req, res, next, id) {
  var query = TestReport.findById(id);

  query.exec(function (err, report){
    if (err) { return next(err); }
    if (!report) { return next(new Error("can't find report")); }

    req.testreport = report;
    return next();
  });
});

router.get('/api/testreport', function(req, res, next) {
  if (req.query && req.query.title) {
    TestReport.find({title: decodeURIComponent(req.query.title)}, function(err, report){
      if(err){ return next(err); }

      res.json(report);
    });
  } else {
    TestReport.find(function(err, reports){
      if(err){ return next(err); }

      res.json(reports);
    });
  }
});

router.delete('/api/testreport/:testreport', function(req, res) {
  var fs = require('fs-extra')
  fs.remove('uploads/' + req.testreport.title, function(err) {
    if (err) return console.error(err)

    console.log("Delete source gz success")
  });
  fs.remove('reports/' + req.testreport.title, function(err) {
    if (err) return console.error(err)

    console.log("Delete extracted content success")
  })
  req.testreport.remove(function(err, report){
    if (err) { return next(err); }

    res.json(report);
  });
});

