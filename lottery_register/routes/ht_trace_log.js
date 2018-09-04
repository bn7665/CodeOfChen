
var express = require('express');
const https = require('http');
var querystring = require('querystring');
var router = express.Router();

router.post('/', function(req, res, next) {
    console.log(req.body);
	
    let post_options = {
	  hostname: 'datacollector.hotaimotor.com.tw',
	  //hostname: '127.0.0.1',
	  port: 3000,
	  headers:{"Content-Type": "application/json"},
	  path: '/api/ytff',
	  method: 'POST'
	};
	let post_data = querystring.stringify(req.body);
	
	let post_req = https.request(post_options, function(resp) {
	  //resp.setEncoding('utf8');
	  let data = [];
	  resp.on('data', function(chunk) {
			data.push(chunk);
		}).on('end', function() {
			let retStr = Buffer.concat(data);
			res.send(retStr);
		});
	});
	post_req.write(post_data);
	post_req.end();

});

module.exports = router;
