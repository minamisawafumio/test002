var createError		= require('http-errors');
var express			= require('express');
var path			= require('path');
var cookieParser	= require('cookie-parser');
var logger			= require('morgan');
var moment			= require("moment");

var session         = require('express-session');
var bodyParser      = require('body-parser');

var mainRouter      = require('./routes/main');
var registRouter    = require('./routes/regist');
var searchRouter    = require('./routes/search');
var usersRouter     = require('./routes/users');
var calcRouter      = require('./routes/calc');
var uploadRouter    = require('./routes/upload');
var systemRouter    = require('./routes/system');

var app = express();

var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next();
}

// テンプレートエンジンの設定
app.set("views", "./views");
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); 

// ミドルウエアの設定
app.use(requestTime);
app.use("/public", express.static("public"));
app.use(cookieParser());
app.use(session({ secret: "YOUR SECRET SALT", resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ルーティングの設定
app.use('/main'		, mainRouter);
app.use('/regist'	, registRouter);
app.use('/search'	, searchRouter);
app.use('/users'	, usersRouter);
app.use('/calc'     , calcRouter);
app.use('/upload'   , uploadRouter);
app.use('/system'   , systemRouter);

module.exports = app;
