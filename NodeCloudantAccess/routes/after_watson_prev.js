
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('table', { 
		title: '之前與Watson之對話',
		query_template : JSON.stringify({
			"selector": {
				"type": {
					"$eq": "AfterWatson"
				}
			},
			sort: [{"timestamp": "desc"}]
		}),
		table:'music_statistic',
		prev: true
	});
});

module.exports = router;
