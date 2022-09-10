var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var sassMiddleware = require('node-sass-middleware');
const mysql2 = require('mysql2');
require('dotenv').config();

var indexRouter = require('./routes/index');

var app = express();

connection = mysql2.createConnection({
  host: process.env.mysql_host || 'localhost',
  user: process.env.mysql_user,
  password: process.env.mysql_password,
  database: process.env.mysql_database
});

connection.connect(function (e) {
  if (e) {
    return console.error('error: ' + e.message);
  }

  console.log(`\nConnected to the MySQL server ${process.env.mysql_database}\n`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
