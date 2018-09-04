
const settings = require('../configs.js');
//const logger = require('../js/logger') || console;
const logger = console;

var express = require('express');
var fs = require('fs');
var router = express.Router();

var db= "line_prod_cloudantDB";
var table_name = "lottery_data";
var account = settings[db].account;
var password = settings[db].password;
var Cloudant = require('@cloudant/cloudant');
//var cloudant = Cloudant({account:account, password:password});
var cloudant = Cloudant({account:account, password:password,plugins: [ 'cookieauth', 'promises', { retry: { retryDelayMultiplier: 4 } } ]});

var table = cloudant.db.use(table_name);

router.post('/', function(req, res, next) {
	
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	let insert_data = req.body;
	let username = insert_data.username;
	let telphone = insert_data.telphone;
	let email = insert_data.email;
	logger.log("insert_data",insert_data);
	
	let dupcheck = telphone.startsWith("09")?[
						{"telphone":telphone},
						{"email":email}
					]:[
						{"email":email}
					];
	
	table.find({
		"selector":{
			"$or": dupcheck
		}
	}, function(err, result) {
		if (!err) {
			if(result.docs.length>0){
				logger.log("duplicate amount:"+result.docs.length);
				let catalog = "";
				if(result.docs[0].email == email){
					catalog="email";
				}else if(telphone.startsWith("09") && result.docs[0].telphone == telphone){
					catalog="telphone";
				}
				res.send("duplicate "+catalog);
			}else{
				table.insert(insert_data, function(err, body, headers) {
					if (!err) {
						res.send("success");
						logger.log("Insert Success");
					}else{
						res.send("error");
						logger.log("Insert Error");
					}
				});
			}
		}else{
			res.send("error");
			logger.log("Insert Error");
		}
	});
});

module.exports = router;
