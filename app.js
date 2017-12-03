"use strict";

var express = require('express');
var cookieParser = require('cookie-parser');
var router = require('./router');

var app = express();
app.use(cookieParser());
app.use(router);
//app.use('/sr/static/', express.static('public'));
app.use('/', express.static('public'));

module.exports = app;