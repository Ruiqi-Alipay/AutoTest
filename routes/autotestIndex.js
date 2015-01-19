var express = require('express');
var fs = require('fs');
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

    fs.readFile(file.path, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('Data: ' + data);

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
          } else {
            console.log('Report saved: ' + report);
          }
        });
      }
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
  TestReport.find(function(err, reports){
    if(err){ return next(err); }

    res.json(reports);
  });
});

router.delete('/api/testreport/:testreport', function(req, res) {
  fs.unlink('uploads/' + req.testreport.title);
  req.testreport.remove(function(err, report){
    if (err) { return next(err); }

    res.json(report);
  });
});

router.get('/api/reportdata', function(req, res, next) {
  var file = decodeURIComponent(req.query.file);
  var index = req.query.index;

  fs.readFile('uploads/' + file, function(err, data) {
    if (err) { return next(err); }

    var report = JSON.parse(data);
    res.json(report[index].data);
  });
});

