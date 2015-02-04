var express = require('express');
var fs = require('fs');
var targz = require('tar.gz');
var router = express.Router();
var moment = require('moment');
moment().utcOffset(8);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('autotestIndex', { title: 'Express' });
});

module.exports = router;

var mongoose = require('mongoose');
var TestScript = mongoose.model('TestScript');
var TestReport = mongoose.model('TestReport');
var TestScriptFolder = mongoose.model('TestScriptFolder');
var ScriptParameter = mongoose.model('ScriptParameter');
var TestApp = mongoose.model('TestApp');

/* for java client usage */
router.get('/api/sysconfiglist', function(req, res, next) {
  TestScript.find({type: 'SysConfig'}, function(err, scripts){
    if(err){ return next(err); }

    res.json(scripts);
  });
});

router.get('/api/environment/checkversion', function(req, res, next) {
  fs.readFile('./environment/version.json', function(err, data) {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      var system = JSON.parse(data);
      res.json(system);
    }
  });
});
router.get('/api/scriptlist', function(req, res, next) {
  TestScript.find({type: 'Script'}, function(err, scripts){
    if(err){ return next(err); }

    var hasScritpFolderMap = {};
    var unFolderedScript = [];
    scripts.forEach(function(script) {
      if (script.folder && 'UNFORDERED' != script.folder) {
        hasScritpFolderMap[script.folder] = '';
      } else {
        unFolderedScript.push(script);
      }
    });

    TestScriptFolder.find(function(err, folders){
      if(err){ return next(err); }

      var selectList = [];
      var folderMap = {};
      var index = 0;
      folders.forEach(function(folder) {
        if (folder._id in hasScritpFolderMap) {
          index++;
          folderMap[folder._id] = folder.title;
          selectList.push({
            title: folder.title,
            key: '' + index
          });

          var scriptIndex = 1;
          scripts.forEach(function(script) {
            if (script.folder == folder._id) {
              selectList.push({
                title: script.title,
                key: index + '.' + scriptIndex,
                id: script._id
              });
              scriptIndex++;
            }
          });
        }
      });

      if (unFolderedScript.length > 0) {
        index++;
        selectList.push({
          title: '未分组脚本',
          key: index
        });

        unFolderedScript.forEach(function(script, scriptIndex) {
          selectList.push({
            title: script.title,
            key: index + '.' + (scriptIndex + 1),
            id: script._id
          });
        });
      }

      res.json(selectList);
    });
  });
});

router.get('/api/getscripts', function(req, res, next) {
  var ids = req.param('ids');
  if (ids) {
    ScriptParameter.find(function(err, params){
      var idArray = ids.split(',');
      TestScript.find({'_id': {'$in' : idArray}}, function(err, scripts) {
        if(err){ return next(err); }

        TestScriptFolder.find(function(err, folders){
          if(err){ return next(err); }

          var folderNameMap = {};
          folders.forEach(function(item) {
            folderNameMap[item._id] = item.title;
          });

          var clientScripts = [];
          scripts.forEach(function(script) {
            var item = JSON.parse(script.content);
            item.title = item.title + '-' + folderNameMap[script.folder];
            clientScripts.push(item);
          });

          var configIds = [];
          clientScripts.forEach(function(script) {
            if (script.configRef) {
              configIds.push(script.configRef);
            }
          });


          TestScript.find({$or: [{'_id': {'$in' : configIds}}, {'title': 'ROLLBACK_ACTIONS'}]}, function(err, configs) {
              if(err){ return next(err); }

              var clientConfigs = [];
              configs.forEach(function(config) {
                var item = JSON.parse(config.content);
                item.id = config._id;
                clientConfigs.push(item);
              });

              res.json({
                scripts: clientScripts,
                configs: clientConfigs,
                params: params
              });
          });

        });
      });
    });
  } else {
    res.json({error: 'ids not provided'});
  }
});

/* TestApp */
router.post('/api/testapp', function(req, res) {
    var file = req.files.file;

    console.log(req.body);

    var newItem = new TestApp();
    newItem.name = file.name;
    newItem.path = file.path;
    newItem.type = file.type;
    newItem.description = req.body.description;
    newItem.save(function(err, item){
      if(err){ return next(err); }
      res.json(item);
    });
});

router.get('/api/testapp', function(req, res, next) {
  TestApp.find(function(err, items){
    if(err){ return next(err); }

    res.json(items);
  });
});

router.param('testapp', function(req, res, next, id) {
  var query = TestApp.findById(id);

  query.exec(function (err, item){
    if (err) { return next(err); }
    if (!item) { return next(new Error("can't find item")); }

    req.testapp = item;
    return next();
  });
});

router.delete('/api/testapp/:testapp', function(req, res) {
  var fs = require('fs-extra')
  fs.remove('uploads/' + req.testapp.name, function(err) {
    if (err) return console.error(err)

    console.log("Delete apk success")
  });
  req.testapp.remove(function(err, item){
    if (err) { return next(err); }

    res.json(item);
  });
});

/* Script parameter */
router.get('/api/scriptparameter', function(req, res, next) {
  ScriptParameter.find(function(err, params){
    if(err){ return next(err); }

    res.json(params);
  });
});

router.post('/api/scriptparameter', function(req, res, next) {
  if (req.body._id) {
    var query = ScriptParameter.findById(req.body._id);
    query.exec(function (err, parameter){
      if (err) { return next(err); }
      if (!parameter) { return next(new Error("can't find parameter")); }
      parameter.name = req.body.name;
      parameter.value = req.body.value;

      parameter.save(function(err, value){
        if(err){ return next(err); }
        res.json(value);
      });
    });
  } else {
    ScriptParameter.find({name: req.body.name}, function(err, param) {
      if (param.length > 0) {
          res.json({error: 'name already exit!', object: param});
      } else {
        var newItem = new ScriptParameter(req.body);
        newItem.save(function(err, item){
          if(err){ return next(err); }
          res.json(item);
        });
      }
    });
  }
});

router.param('scriptparameter', function(req, res, next, id) {
  var query = ScriptParameter.findById(id);

  query.exec(function (err, param){
    if (err) { return next(err); }
    if (!param) { return next(new Error("can't find param")); }

    req.scriptparameter = param;
    return next();
  });
});

router.delete('/api/scriptparameter/:scriptparameter', function(req, res) {
  req.scriptparameter.remove(function(err, param){
    if (err) { return next(err); }

    res.json(param);
  });
});

/* Test Script Folder */
router.get('/api/testscriptfolder', function(req, res, next) {
  TestScriptFolder.find(function(err, folders){
    if(err){ return next(err); }

    res.json(folders);
  });
});

router.post('/api/testscriptfolder', function(req, res, next) {
  if (req.body._id) {
    var query = TestScriptFolder.findById(req.body._id);
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
    var folder = new TestScriptFolder(req.body);

    folder.save(function(err, folder){
      if(err){ return next(err); }
      res.json(folder);
    });
  }
});

router.param('testscriptfolder', function(req, res, next, id) {
  var query = TestScriptFolder.findById(id);

  query.exec(function (err, folder){
    if (err) { return next(err); }
    if (!folder) { return next(new Error("can't find folder")); }

    req.testscriptfolder = folder;
    return next();
  });
});

router.delete('/api/testscriptfolder/:testscriptfolder', function(req, res) {
  req.testscriptfolder.remove(function(err, folder){
    if (err) { return next(err); }

    res.json(folder);
  });
});

/* Test Script */
router.get('/api/testscript', function(req, res, next) {
  if (req.query && req.query.id) {
    var query = TestScript.findById(req.query.id);
    query.exec(function (err, script){
      if (err) { return next(err); }
      res.json(script);
    });
  } else {
    TestScript.find({}, {folder: 1, title: 1, type: 1, date: 1}, function(err, scripts){
      if(err){ return next(err); }

      res.json(scripts);
    });
  }
});

router.post('/api/testscript', function(req, res, next) {
  if (req.body._id) {
    var query = TestScript.findById(req.body._id);
    query.exec(function (err, script){
      if (err) { return next(err); }
      if (!script) { return next(new Error("can't find script")); }
      script.content = req.body.content;
      script.title = req.body.title;
      script.type = req.body.type;
      script.folder = req.body.folder;
      script.date = moment();

      script.save(function(err, script){
        if(err){ return next(err); }
        res.json(script);
      });
    });
  } else {
    req.body.date = moment();
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
router.post('/api/report', function(req, res, next) {
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
            try {
              var records = JSON.parse(data);
              records.forEach(function(value, index) {
                delete value['data'];
              });

              var report = new TestReport();
              report.title = file.name;
              report.content = JSON.stringify(records);
              report.date = moment();
              report.save(function(err, report){
                if(err){
                  console.log('Report save error: ' + err);
                  return next(err);
                } else {
                  res.json(report);
                }
              });
            } catch (err) {
              return next(err);
            }
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
    var query = TestReport.find({}, {date: 1, title: 1}).sort({ date: -1 });

    query.exec(function(err, reports){
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

