
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('table', { 
		title: '使用者資訊',
		query_template : JSON.stringify({
			"selector": {
			},
			sort: [{"timestamp": "desc"}]
		}),
		table:'normal_profile' ,
		prev: false
	});
});

module.exports = router;
