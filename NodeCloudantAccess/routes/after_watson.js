
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('table', { 
		title: '與Watson之對話',
		query_template : JSON.stringify({
			"selector": {
				"type": {
					"$eq": "AfterWatson"
				}
			},
			sort: [{"timestamp": "desc"}]
		}),
		table:'normal_statistic',
		prev: false
	});
});

module.exports = router;
