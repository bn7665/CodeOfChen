var express = require('express'); var router = express.Router(); const http 
= require('http'); router.get('/', function(req, res, next) {
	http.get("http://vl7.net/ip", function(resp) {
		var data = [];
		resp.on('data', function(chunk) {
			data.push(chunk);
		}).on('end', function() {
			var datas = Buffer.concat(data);
			res.send(datas.toString());
		});
	});
});
module.exports = router;
