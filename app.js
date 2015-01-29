var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');

mongoose.connect('mongodb://localhost/news');
require('./models/TestScriptFolder');
require('./models/TestScript');
require('./models/TestReport');
require('./models/Scripts');
require('./models/ScriptParameter');
require('./models/TestApp');

var rootRoutes = require('./routes/rootIndex')
var autotestRoutes = require('./routes/autotestIndex');
var sdkeditorRoutes = require('./routes/sdkeditorIndex');
var reporterRoutes = require('./routes/reporterIndex');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(multer({
    dest: './uploads/',
    rename: function(fieldname, filename) {
        return filename;
    },
    onFileUploadStart: function(file) {
        console.log(file.originalname + ' is starting...');
    },
    onFileUploadComplete: function(file) {
        console.log(file.originalname + ' is done');
    }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/environment', express.static(path.join(__dirname, '/environment')));
app.use('/autotest', express.static(path.join(__dirname, '/public/autotest')));
app.use('/autotest/bower_components',  express.static(path.join(__dirname, '/bower_components')));
app.use('/sdkeditor', express.static(path.join(__dirname, '/public/sdkeditor')));
app.use('/sdkeditor/bower_components',  express.static(path.join(__dirname, '/bower_components')));
app.use('/reporter', express.static(path.join(__dirname, '/public/reporter')));
app.use('/reporter/bower_components',  express.static(path.join(__dirname, '/bower_components')));
app.use('/reporter/reports', express.static(path.join(__dirname, '/reports')));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));

app.use('/', rootRoutes);
app.use('/autotest', autotestRoutes);
app.use('/sdkeditor', sdkeditorRoutes);
app.use('/reporter', reporterRoutes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
