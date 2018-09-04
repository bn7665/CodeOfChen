
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('table', { 
		title: '之前的使用者資訊',
		query_template : JSON.stringify({
			"selector": {
			},
			sort: [{"timestamp": "desc"}]
		}),
		table:'music_profile',
		prev: true
	});
});

module.exports = router;
