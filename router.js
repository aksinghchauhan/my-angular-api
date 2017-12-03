"use strict";

var logger = require('winston');
var express = require("express");
var config = require('config');
//var deviceCtrl = require('./controllers/device/main');
var bodyParser = require('body-parser');
var fooApi = require('./controllers/api/backend');

var vendorApi = require('./controllers/api/vendorws');

var app = module.exports = express();

logger.debug("registering ui middleware");
//app.get("/ui/devices", deviceCtrl.hello);

app.get("/sr/api/foo", fooApi.getFoo);
app.get("/sr/api/login", fooApi.getLogin);
app.get("/sr/api/sendMail", fooApi.sendMail);
app.post("/sr/api/fileUpload", fooApi.fileUpload);
app.get("/sr/api/getUserName", fooApi.getUserDetails);
app.post("/sr/api/addDetails", fooApi.onAdd);

app.get("/sr/api/getvendorlist", vendorApi.getvendorlist);
//app.get("/sr/api/getvendorDetail", vendorApi.getvendorDetail);