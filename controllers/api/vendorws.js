var logger = require('winston');
var express = require('express');
var app = express();
var multer = require('multer');
var CircularJSON = require('circular-json');
var connect = require('../connect.js');
var uuid = require('node-uuid');

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

module.exports.getCityNames = function(req, res) {
	var cities = [
		{
			"name" : "Lucknow",
			"Code" : "1"
		},
		{
			"name" : "Kanpur",
			"Code" : "2"
		},
		{
			"name" : "Allahabad",
			"Code" : "3"
		},
		{
			"name" : "Rae Bareli",
			"Code" : "4"
		},
		{
			"name" : "Bareli",
			"Code" : "5"
		},
		{
			"name" : "Sitapur",
			"Code" : "6"
		}
	];
	res.send(cities);
}

module.exports.getLogin = function(req, res) {
	logger.debug("Inside Alerts Router Handler");
	logger.debug("req=" + JSON.stringify(req.query));
	var name = req.query.first_name + " " + req.query.last_name;
	var email = req.query.email;
	res.json("success");
};

module.exports.registerVendor = function(req, res) {
	var obj = req.body.vendor;
	logger.log('info', "Value in DB registerVendor" + JSON.stringify(req.body.vendor));
	
	var client = connect.getClient();
	client.execute('INSERT INTO report.vendor_registration '
	+ ' (vendor_id,vendor_name,address,rate,description,phone,place,email,image1,image2,image3,image4,image5,'
	+ ' image6,image7,image8,image9,image10,registration_date,main_image)'
	+ ' values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [ uuid.v1(), obj.vendor_name, obj.address, obj.rate, obj.description,
		obj.phone, obj.place, obj.email, obj.image1, obj.image2, obj.image3, obj.image4, obj.image5,
		obj.image6, obj.image7, obj.image8, obj.image9, obj.image10, Date.now(),req.body.main_imagev ],
		function(err) {
			if (err) {
				res.status(500).send({
					msg : 'Method:registerVendor::Request:insertNewRecord could not be processed due to an internal error' + err
				});
			} else {
				logger.log('info', "Successfully added vendor into DB table report.vendor_registration .");
				res.json("SUCCESS");
			}
		});
}