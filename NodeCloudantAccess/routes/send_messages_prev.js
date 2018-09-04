
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('table', { 
		title: '之前使用者說的話',
		query_template : JSON.stringify({
			"selector": {
				"type": {
					"$eq": "SendMessages"
				}
			},
			sort: [{"timestamp": "desc"}]
		}),
		table:'music_statistic',
		prev: true
	});
});

module.exports = router;
