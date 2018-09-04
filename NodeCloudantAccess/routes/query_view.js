
const settings = require('../configs.js');
const logger = require('../js/logger') || console;
//const logger = console;
var account = settings.cloudantDB.account;
var password = settings.cloudantDB.password;
var express = require('express');
var router = express.Router();

var Cloudant = require('@cloudant/cloudant');
var cloudant = Cloudant({account:account, password:password});

router.post('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	
	let table_name = req.body.table_name;
	let view_name = req.body.view_name;
	
	let normal_statistic = cloudant.db.use(table_name);
	normal_statistic.view(view_name,view_name, { 
		reduce:true,
		group:true
	},function(err, body) {

	  if (!err) {
		  res.send(body.rows)
		/*body.rows.forEach(function(doc) {
		  res.send(doc)
		});*/
	  }
	});
});

module.exports = router;

