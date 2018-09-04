
const settings = require('../configs.js');
const logger = /*require('../js/logger') || */console;
//const logger = console;
//var account = settings.cloudantDB.account;
//var password = settings.cloudantDB.password;
var JSONStream = require('JSONStream');
var fs = require('fs');
var express = require('express');
var router = express.Router();

var Cloudant = require('@cloudant/cloudant');


router.post('/', function(req, res, next) {
	
	/*if(req.body.temp2!=null){
		fs.createReadStream('20180823_line_data.json')
			.pipe(JSONStream.parse(req.body.temp2))
			.on('data', entry => {
				console.log('entry', entry);
			});
		res.send("thanks");
		return;
	}*/
	console.log(req.body);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	var db_name = req.body.db_name; //"line_test_cloudantDB";
	let account = settings[db_name].account;
	let password = settings[db_name].password;
	var cloudant = Cloudant({account:account, password:password});
	let table_name = req.body.table_name;
	let view_name = req.body.view_name;
	
	let table = cloudant.db.use(table_name);

	table.view(view_name,view_name, { 
		reduce:true,
		group:true
	},function(err, body) {

	  if (!err) {
		  res.send(body.rows);
		/*body.rows.forEach(function(doc) {
		  res.send(doc)
		});*/
	  }else{
		  res.send("error");
		  throw err;
	  }
	});
});

module.exports = router;

