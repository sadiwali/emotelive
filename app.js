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

users = [
  {
      "r": "231",
      "g": "40",
      "b": "19",
      "name": "Sadi",
      "userId": "202855c0-54b9-11ec-b513-434b4c0975f5"
  },
  {
      "r": "55",
      "g": "186",
      "b": "27",
      "name": "james",
      "userId": "d2c8c6e0-5579-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "255",
      "b": "255",
      "name": "jony",
      "userId": "527af7c0-54bf-11ec-b513-434b4c0975f5"
  },
  {
      "r": "105",
      "g": "255",
      "b": "0",
      "name": "jony",
      "userId": "53c80030-557a-11ec-9dfb-45d71437700a"
  },
  {
      "r": "223",
      "g": "234",
      "b": "224",
      "name": "Pop",
      "userId": "74290860-557a-11ec-9dfb-45d71437700a"
  },
  {
      "r": "218",
      "g": "255",
      "b": "226",
      "name": "Andy ",
      "userId": "e1035380-557c-11ec-9dfb-45d71437700a"
  },
  {
      "r": "84",
      "g": "125",
      "b": "255",
      "name": "Kevin",
      "userId": "7f572be0-551b-11ec-b7d2-4d45e0e8d6fd"
  },
  {
      "r": "50",
      "g": "128",
      "b": "251",
      "name": "Albert",
      "userId": "b1efd2d0-54b9-11ec-b513-434b4c0975f5"
  },
  {
      "r": "153",
      "g": "141",
      "b": "212",
      "name": "Daniel Lim",
      "userId": "16989d60-5583-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "165",
      "b": "181",
      "name": "Stranger",
      "userId": "32b40ca0-5583-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "255",
      "b": "255",
      "name": "Yousef",
      "userId": "237b1b70-5583-11ec-9dfb-45d71437700a"
  },
  {
      "r": "0",
      "g": "0",
      "b": "0",
      "name": "Mamun",
      "userId": "dbb56e20-5583-11ec-9dfb-45d71437700a"
  },
  {
      "r": "226",
      "g": "239",
      "b": "44",
      "name": "Ruslan",
      "userId": "a2b30cd0-5584-11ec-9dfb-45d71437700a"
  },
  {
      "r": "19",
      "g": "231",
      "b": "46",
      "name": "ruslan",
      "userId": "b5986430-5584-11ec-9dfb-45d71437700a"
  },
  {
      "r": "163",
      "g": "100",
      "b": "58",
      "name": "Lera",
      "userId": "dd802690-5584-11ec-9dfb-45d71437700a"
  },
  {
      "r": "46",
      "g": "255",
      "b": "24",
      "name": "matt",
      "userId": "dde13250-5584-11ec-9dfb-45d71437700a"
  },
  {
      "r": "180",
      "g": "58",
      "b": "194",
      "name": "Nicole",
      "userId": "46e77cf0-5585-11ec-9dfb-45d71437700a"
  },
  {
      "r": "193",
      "g": "151",
      "b": "29",
      "name": "Rachel",
      "userId": "6a513140-5585-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "255",
      "b": "255",
      "name": "Nisaldinho",
      "userId": "83269d40-5585-11ec-9dfb-45d71437700a"
  },
  {
      "r": "0",
      "g": "0",
      "b": "0",
      "name": "Stranger",
      "userId": "883ec870-5585-11ec-9dfb-45d71437700a"
  },
  {
      "r": "176",
      "g": "106",
      "b": "204",
      "name": "Hazel",
      "userId": "a6408e70-5586-11ec-9dfb-45d71437700a"
  },
  {
      "r": "128",
      "g": "128",
      "b": "128",
      "name": "andy",
      "userId": "064bce60-5587-11ec-9dfb-45d71437700a"
  },
  {
      "r": "86",
      "g": "234",
      "b": "54",
      "name": "karen",
      "userId": "f89d9150-5585-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "125",
      "b": "0",
      "name": "Duke",
      "userId": "348976a0-5588-11ec-9dfb-45d71437700a"
  },
  {
      "r": "216",
      "g": "221",
      "b": "142",
      "name": "Teiji",
      "userId": "6134db90-5588-11ec-9dfb-45d71437700a"
  },
  {
      "r": "108",
      "g": "208",
      "b": "65",
      "name": "Karim roufs",
      "userId": "6de7c8b0-5589-11ec-9dfb-45d71437700a"
  },
  {
      "r": "83",
      "g": "214",
      "b": "125",
      "name": "Someone",
      "userId": "d8c0d780-5589-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "192",
      "b": "255",
      "name": "maria kestane",
      "userId": "93e29d40-558b-11ec-9dfb-45d71437700a"
  },
  {
      "r": "76",
      "g": "159",
      "b": "3",
      "name": "sami",
      "userId": "14159070-558d-11ec-9dfb-45d71437700a"
  },
  {
      "r": "188",
      "g": "117",
      "b": "46",
      "name": "Justina Yang",
      "userId": "b0288d00-558d-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "255",
      "b": "255",
      "name": "Peter T",
      "userId": "ff6bbad0-558e-11ec-9dfb-45d71437700a"
  },
  {
      "r": "0",
      "g": "255",
      "b": "255",
      "name": "Pierre Ghaly",
      "userId": "648e3b90-558f-11ec-9dfb-45d71437700a"
  },
  {
      "r": "0",
      "g": "67",
      "b": "0",
      "name": "Stranger",
      "userId": "af0b7ce0-5590-11ec-9dfb-45d71437700a"
  },
  {
      "r": "36",
      "g": "166",
      "b": "49",
      "name": "Omar",
      "userId": "08da35e0-5591-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "219",
      "b": "0",
      "name": "Haywood Jablomi",
      "userId": "dd4b9620-5591-11ec-9dfb-45d71437700a"
  },
  {
      "r": "0",
      "g": "0",
      "b": "0",
      "name": "Yousschaf",
      "userId": "1fd87ea0-5596-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "0",
      "b": "111",
      "name": "Josephson",
      "userId": "8a1318a0-5598-11ec-9dfb-45d71437700a"
  },
  {
      "r": "106",
      "g": "216",
      "b": "80",
      "name": "Andrew",
      "userId": "a58ff690-559b-11ec-9dfb-45d71437700a"
  },
  {
      "r": "102",
      "g": "189",
      "b": "82",
      "name": "Markimoo",
      "userId": "8f2604f0-559e-11ec-9dfb-45d71437700a"
  },
  {
      "r": "193",
      "g": "28",
      "b": "77",
      "name": "Youssef Garras",
      "userId": "c332e8d0-559e-11ec-9dfb-45d71437700a"
  },
  {
      "r": "69",
      "g": "199",
      "b": "100",
      "name": "Picasso",
      "userId": "16dd5dd0-559f-11ec-9dfb-45d71437700a"
  },
  {
      "r": "193",
      "g": "74",
      "b": "128",
      "name": "Stranger",
      "userId": "149ba3d0-55a2-11ec-9dfb-45d71437700a"
  },
  {
      "r": "81",
      "g": "193",
      "b": "29",
      "name": "J",
      "userId": "285f8110-55b2-11ec-9dfb-45d71437700a"
  },
  {
      "r": "58",
      "g": "196",
      "b": "54",
      "name": "David",
      "userId": "16697240-55df-11ec-9dfb-45d71437700a"
  },
  {
      "r": "155",
      "g": "75",
      "b": "177",
      "name": "Zander",
      "userId": "0bded240-55b0-11ec-9dfb-45d71437700a"
  },
  {
      "r": "198",
      "g": "36",
      "b": "201",
      "name": "Pris",
      "userId": "ea412330-55e2-11ec-9dfb-45d71437700a"
  },
  {
      "r": "78",
      "g": "181",
      "b": "26",
      "name": "Sadi",
      "userId": "946eda40-55e4-11ec-9dfb-45d71437700a"
  },
  {
      "r": "128",
      "g": "128",
      "b": "128",
      "name": "Min",
      "userId": "e972a0e0-55e8-11ec-9dfb-45d71437700a"
  },
  {
      "r": "216",
      "g": "129",
      "b": "196",
      "name": "Min",
      "userId": "4fa86660-55e9-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "128",
      "b": "57",
      "name": "Athina",
      "userId": "33160780-55eb-11ec-9dfb-45d71437700a"
  },
  {
      "r": "81",
      "g": "213",
      "b": "231",
      "name": "Divyaraj",
      "userId": "b4e2df20-55ed-11ec-9dfb-45d71437700a"
  },
  {
      "r": "255",
      "g": "72",
      "b": "165",
      "name": "Chris",
      "userId": "4fa61b70-55f4-11ec-9dfb-45d71437700a"
  },
  {
      "r": "99",
      "g": "167",
      "b": "33",
      "name": "Michelangelo",
      "userId": "58b291a0-55fc-11ec-9dfb-45d71437700a"
  }
];

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