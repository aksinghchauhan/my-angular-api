var logger = require('winston');

var express = require('express');
var app = express();
var multer = require('multer');

var storage = multer.diskStorage({
	destination : function(req, file, callback) {
		callback(null, './fileUpload');
	},
	filename : function(req, file, callback) {
		callback(null, file.originalname);
	}
});
var upload = multer({
	storage : storage
}).single('myfile');



module.exports.getFoo = function(req, res) {
	var foos = [ {
		"value" : "foo"
	}, {
		"value" : "bar"
	} ];
	res.json(foos);
};

module.exports.getLogin = function(req, res) {
	logger.debug("Inside Alerts Router Handler");
	logger.debug("req=" + JSON.stringify(req.query));
	var name = req.query.first_name + " " + req.query.last_name;
	var email = req.query.email;

	// add db code
	res.json("success");
};

module.exports.fileUpload = function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			return res.end("FAILURE");
		}
		res.end("SUCCESS");
	});
}

module.exports.getUserDetails = function(req, res) {
	//need to connect to db to get user details
	console.log('Email in WS..' + req.query.loginEmail);
	var username = "test User";


	res.json(username);
}



module.exports.onAdd = function(req, res) {
	var respo = "Thanks for adding details : " + req.body.name;
	var status = "success";
	var value = {
		"response" : respo,
		"status" : status
	};
	res.json(respo);
};

module.exports.sendMail = function(req, res) {

	var name = req.query.first_name + " " + req.query.last_name;
	var email = req.query.email;
	logger.debug("name=" + name);
	logger.debug("email=" + email);
	var mymail = 'singh227341@gmail.com';
	var mypwd = 'abhisek94';
	var myMessage = "Hello "
		+ name
		+ " , \n Thanks for your interest .We are happy to help you to find great job ."
		+ "\n" + " \n Regards \n Job Finder Team";
	var subject = 'Welcome to Job Finder.'
	var myservice = 'Gmail';

	var transporter = nodemailer.createTransport({
		service : myservice,
		auth : {
			user : mymail,
			pass : mypwd
		}
	});

	var mailOptions = {
		from : mymail, // sender address
		to : email, // list of receivers
		subject : subject, // Subject line
		text : myMessage
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
			res.json('error');
		} else {
			console.log('Message sent: ' + info.response);
			res.json('success');
		}
		;
	});
}