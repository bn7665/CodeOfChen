
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('table', { 
		title: '使用者說的話',
		query_template : JSON.stringify({
			"selector": {
				"type": {
					"$eq": "SendMessages"
				}
			},
			sort: [{"timestamp": "desc"}]
		}),
		table:'normal_statistic',
		prev:false
	});
});

module.exports = router;
