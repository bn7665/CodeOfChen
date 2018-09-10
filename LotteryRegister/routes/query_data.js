
const settings = require('../configs.js');
//const logger = require('../js/logger') || console;
const logger = console;
var express = require('express');
var fs = require('fs');
var router = express.Router();

var Cloudant = require('@cloudant/cloudant');
router.post('/', function(req, res, next) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	
	var db= req.body.db_name;
	var account = settings[db].account;
	var password = settings[db].password;
	var cloudant = Cloudant({account:account, password:password,plugins: [ 'cookieauth', 'promises', { retry: { retryDelayMultiplier: 4 } } ]});
	
	let table_name = req.body.table;
	//let sql_query = req.body.sql_query;
	//let raw_data = req.body.raw_data;
	//let prev = req.body.prev;
	let cloudant_query = req.body.cloudant_query;
	
	let query_nosql = null;
	try {
		query_nosql = JSON.parse(cloudant_query);
	} catch (e) {
		console.log("cloudant_query_not_json_str");
		res.send("[]");
		return ;
	}
	
	let cloudant_table = cloudant.db.use(table_name);
	logger.log("table_name",table_name);
	logger.log("query_nosql",query_nosql);
	let flatten_result = [];
	cloudant_table.find(query_nosql, function(err, result) {
		console.log(err);
		if (!err) {
			logger.log("result.docs.length: " + result.docs.length);
			res.send(JSON.stringify(result.docs));
		}else{
			res.send("error");
			throw err;
		}
	});
	
});

module.exports = router;
