
const settings = require('../configs.js');
//const logger = require('../js/logger') || console;
const logger = console;
//var account = settings.cloudantDB.account;
//var password = settings.cloudantDB.password;
var express = require('express');
var JSONStream = require('JSONStream');
var fs = require('fs');
var router = express.Router();

var Cloudant = require('@cloudant/cloudant');
//var cloudant = Cloudant({account:account, password:password});

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
		//console.log(err);
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

//###save file###
/*
fs.createReadStream('20180823_line_data.json')
.pipe(JSONStream.parse(dataStr))
.on('data', entry => {
	console.log('entry', entry);
});
*/
/*let output_arr = [];
	for(let i=0;i<result.docs.length;i++){
		output_arr.push({
			time: result.docs[i].time,
			timestamp: result.docs[i].timestamp,
			conversation_id: result.docs[i].conversation_id
		})
	}
	//console.log(result);
	fs.writeFile("statistic.json", JSON.stringify(output_arr), function(err) {
		if(err) {
			return console.log(err);
		}else{
			console.log("The file was saved!");
		}
	});*/




/* OLD CODE
	cloudant_table.find(query_nosql, function(err, result) {
		console.log(err);
		if (!err) {
			//console.log(result);
			
			for(let i=0;i<result.docs.length;i++){
				item = result.docs[i]
				item.payload.context = {
					conversation_id: item.payload.context.conversation_id,
					doActions: item.payload.context.doActions
				};
				
				result.docs[i] = {
					payload :item.payload 
				};
			}
			fs.writeFile("temp_data.json", JSON.stringify(result.docs), function(err) {
				if(err) {
					return console.log(err);
				}else{
					console.log("The file was saved!");
				}
			});
			logger.log("result.docs.length: " + result.docs.length);
			res.send(JSON.stringify(result.docs));
		}else{
			throw err;
		}
	});

*/
