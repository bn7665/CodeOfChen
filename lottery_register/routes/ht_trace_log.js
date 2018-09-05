
var express = require('express');
const https = require('https');
var querystring = require('querystring');
//const logger = require('./logger') || console;
var router = express.Router();

router.post('/', function(req, res, next) {
    console.log(req.body);
	let api_name = req.body.email==null?"canvas":"event";
    let post_options = {
	  hostname: 'datacollector.hotaimotor.com.tw',
	  port: 3000,
	  headers:{
		"Content-Type": "application/json",
		"Accept": "application/json"
	  },
	  path: '/api/'+api_name,
	  method: 'POST'
	};
	
	let post_data = JSON.stringify(req.body);
	//let post_data = querystring.stringify(req.body);
	//console.log(post_options);
	
	let post_req = https.request(post_options, function(resp) {
	  let data = [];
	  resp.on('data', function(chunk) {
			data.push(chunk);
		}).on('end', function() {
			let retStr = Buffer.concat(data).toString('utf8');
			console.log(post_data+":"+retStr);
			res.send(retStr);
		});
	})
	.on('error', function(e){
		console.log("ERROR");
		console.log(e);
		console.log(e.code);
		res.send(e.code);
	});
	
	post_req.setTimeout(3000, function(){
        this.abort();
    }.bind(post_req));
	
	post_req.write(post_data);
	post_req.end();

});

module.exports = router;
