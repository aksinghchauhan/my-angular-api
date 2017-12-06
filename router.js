"use strict";

var logger = require('winston');
var express = require("express");
var config = require('config');
var bodyParser = require('body-parser');

var vendorApi = require('./controllers/api/vendorws');
var connectApi = require('./controllers/connect');

var app = module.exports = express();

logger.debug("registering ui middleware");

app.use(bodyParser.json({
	limit : '50mb'
}));
app.use(bodyParser.urlencoded({
	limit : '50mb',
	extended : true
}));


app.get("/sr/api/getvendorlist", vendorApi.getvendorlist);
app.get("/sr/api/getPersitedValue", connectApi.getPersitedValue);
app.post("/app/vendor/registerVendor", vendorApi.registerVendor);
app.get("/sr/api/getCityNames", vendorApi.getCityNames);