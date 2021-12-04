var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var bodyParser = require('body-parser')
var cors = require("cors");
// var cookieSession = require("cookie-session");
var cookieParser = require("cookie-parser");
var uuid = require('uuid');

users = [] // list of all users and their emotion values

var hbs = require('express-handlebars');
const fs = require('fs');
const {
  options
} = require('express-zip');
const {
  reverse
} = require('dns');

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(cors());

// app.use(cookieSession({
//   name: 'session',
//   keys: ["key1"],

//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))

// Handlebars helpers
var handlebars = hbs.create({
  helpers: {
    ifEquals: function (arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    ifContains: function (arg1, arg2, options) {
      return (arg1.includes(arg2)) ? options.fn(this) : options.inverse(this);
    },
    posHelper: function (arg1, arg2) {
      if (arg2 == -1) {
        arg2 = arg1.length - 1;
      }
      return arg1[arg2];
    },
    future_date: function (arg1, options) {
      return ((new Date(arg1) - Date.now()) >= 0) ? options.fn(this) : options.inverse(this);
    },

    sortUp: function (arg1, options) {
      let new_arg = arg1.slice();
      new_arg.sort(GetSortOrder("id"));
      return options.fn(new_arg);
    },
    sortDown: function (arg1, options) {
      let new_arg = arg1.slice();
      new_arg.sort(GetSortOrder("id")).reverse();
      return options.fn(new_arg);
    }
  },
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/',
  extname: "hbs"
});

var eDatabase = [];

// view engine setup
app.engine('hbs', handlebars.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.message);
  res.send('error');
});


module.exports = app;