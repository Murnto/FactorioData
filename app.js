var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');

var modSelection = require('./routes/mod_selection');
var gitLocals = require('./src/git_locals');
var routes = require('./routes/index');
var itemCats = require('./routes/itemcats');
var api = require('./routes/api').router;
var factoratio = require('./routes/factoratio');

var app = express();
app.use(require('./helpers'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(gitLocals);
app.use('/pack', modSelection.router);
app.use(modSelection.modSelection);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/api', api);
app.use('/itemcats', itemCats);
app.use('/factoratio', factoratio);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    //cacher.noCaching = true
    app.locals.analytics = '';
} else {
    app.locals.analytics = "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-63813475-1', 'auto');ga('send', 'pageview');</script>";
}

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            extended_message: err.extended_message,
            error: err,
            title: (err.status || 500) + ': ' + err.message,
            modpack: res.locals.modpack,
            modpack_title: res.locals.modpack_title
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        extended_message: err.extended_message,
        error: {},
        title: (err.status || 500) + ': ' + err.message,
        modpack: res.locals.modpack,
        modpack_title: res.locals.modpack_title
    });
});


module.exports = app;
