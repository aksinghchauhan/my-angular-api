"use strict";

var express = require('express');
var cassandra = require('cassandra-driver');
var config = require('./db.json');
var logger = require('./logger');

var client = createClient(config.cassandra.contactPoints, config.cassandra.username, config.cassandra.password);

//var client = new cassandra.Client({contactPoints: [config.cassandra.contactPoints], keyspace: 'smartreport'});


module.exports.getPersitedValue = function(req, res) {
	logger.log('info', 'SERVER::in getPersitedValue method ..');

	client.execute("SELECT * FROM report.vendor", [], {
		prepare : true
	}, function(error, result) {
		if (error) {
			logger.log('info', "SERVER::ERROR occured " + error);
			res.status(500).send({
				msg : 'Request:getPersitedValue could not be processed due to an internal error'
			});
		} else {
			logger.log('info', "SERVER::result.rows ===> " + JSON.stringify(result.rows));
			res.json(result.rows);
		}
	});
}

function createClient(contactPoints, username, password) {
	console.log('in createClient method ..');
	var client;
	var cassandraConfig = {};
	cassandraConfig.contactPoints = contactPoints;
	cassandraConfig.authProvider = new cassandra.auth.PlainTextAuthProvider(username, password);
	console.log('Building new cassandra client with user %s', username);
	client = new cassandra.Client(cassandraConfig);
	//this is just for debugging purpose.
	client.connect(function(error /*, res*/ ) {
		if (error) {
			console.log('Could not connect to cassandra for user %s', username);
			console.log(error);
			return;
		}
		client.execute('SELECT now() FROM system.local', [], function(error /*, result*/ ) {
			if (error) {
				console.log('Could not validate connection to cassandra for user %s', username);
				console.log(error);
				return;
			}
			console.log('Cassandra connection initialized for user %s', username);
		});
	});
	return client;
}

var addData = function(filename) {
	logger.log('info', 'SERVER::in insertNewRecord method ..' + filename);

	client.execute('INSERT INTO smartreports.smartwork (id,filename) VALUES (now(), ?)', [ filename ],
		function(err) {
			if (err) {
				res.status(500).send({
					msg : 'Request:insertNewRecord could not be processed due to an internal error' + err
				});
			} else {
				console.log('success!');
				res.json("New record successfully inserted in database!");
			}
		});

}