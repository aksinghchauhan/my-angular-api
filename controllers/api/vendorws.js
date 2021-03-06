var logger = require('winston');
var express = require('express');
var app = express();
var multer = require('multer');

module.exports.getvendorlist = function(req, res) {
	var vendors = [ {
		"id" : "1",
		"place_name" : "The Park Inn",
		"address" : "The Park Inn,Lucknow",
		"charges" : "1200 per plate",
		"ratings" : "4.2",
		"reviews_count" : " 1 Review",
		"main_image" : "The_Park_Inn.jpg",
		"about" : "A hotel is an establishment that provides paid lodging on a short-term basis. Facilities provided may range from a modest-quality mattress in a small room to large suites with bigger, higher-quality",
		"reviews" : [ "Hotel is good." ]
	}, {
		"id" : "2",
		"place_name" : "Lotus Inn",
		"address" : "Lotus,Lucknow",
		"charges" : "1000 per plate",
		"ratings" : "3.2",
		"reviews_count" : " 2 Review",
		"main_image" : "Lotus_Inn.jpg",
		"about" : "Lotus Inn is an establishment that provides paid lodging on a short-term basis. Facilities provided may range from a modest-quality mattress in a small room to large suites with bigger, higher-quality",
		"reviews" : [ "good.", "Hotel is no in good location" ]
	}, {
		"id" : "3",
		"place_name" : "Awadh clarks Inn",
		"address" : "Awaadh Clarks,Lucknow",
		"charges" : "800 per plate",
		"ratings" : "2.2",
		"reviews_count" : " 3 Review",
		"main_image" : "Awadh_clarks_Inn.jpg",
		"about" : "Awadh clarks Inn facilities provided may range from a modest-quality mattress in a small room to large suites with bigger, higher-quality",
		"reviews" : [ "Hotel is good.", "Hotel is cool", "Hotel is cool" ]
	}, {
		"id" : "4",
		"place_name" : "ABC Hotel",
		"address" : "Kaisarganj,Lucknow",
		"charges" : "600 per plate",
		"ratings" : "2.0",
		"reviews_count" : " 4 Review",
		"main_image" : "ABC_Hotel.jpg",
		"about" : "ABC hotel facilities provided may range from a modest-quality mattress in a small room to large suites with bigger, higher-quality",
		"reviews" : [ "nice place ", "Hotel is cool", "Hotel is good.", "Hotel is cool" ]
	}, {
		"id" : "5",
		"place_name" : "GPS Inn",
		"address" : "GPS,Lucknow",
		"charges" : "800 per plate",
		"ratings" : "4.2",
		"reviews_count" : " 0 Review",
		"main_image" : "GPS_Inn.jpg",
		"about" : "GPS Inn is an establishment that provides paid lodging on a short-term basis. Facilities provided may range from a modest-quality mattress in a small room to large suites with bigger, higher-quality",
		"reviews" : []
	} ];
	res.send(vendors);
};

module.exports.getLogin = function(req, res) {
	logger.debug("Inside Alerts Router Handler");
	logger.debug("req=" + JSON.stringify(req.query));
	var name = req.query.first_name + " " + req.query.last_name;
	var email = req.query.email;

	// add db code
	res.json("success");
};

