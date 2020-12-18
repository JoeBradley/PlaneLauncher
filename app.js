var express = require('express');
var docserver = require('docserver');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var actionsRouter = require('./routes/actions');

const isProduction = process.env.NODE_ENV === "production";

var app = express();

// Redirect to HTTPS (for production mode)
app.use(function (req, res, next) {
        if (isProduction) {
                // Redirect to HTTPS
                if (req.secure) {
                        // request was via https, so do no special handling
                        next();
                } else {
                        // request was via http, so redirect to https
                        res.redirect('https://' + req.headers.host + req.url);
                }
        } else {
                // Redirect to HTTP (for development)
                if (req.secure) {
                        // request was via http, so redirect to https
                        res.redirect('http://' + req.headers.host + req.url);
                } else {
                        // request was via https, so do no special handling
                        next();
                }
        }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(docserver({
        dir: __dirname + '/public/docs',  // serve Markdown files in the docs directory...
        url: '/'}                  // ...and serve them at the root of the site
      ));

app.use('/', indexRouter);
app.post('/api/actions', actionsRouter);

module.exports = app;
