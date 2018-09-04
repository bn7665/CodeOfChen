
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('table_my_query', { 
		title: 'table_my_query'
		/*,query_template : JSON.stringify({
			"selector": {
				"time": {
					"$gt": "2018-06-14 07:00:00",
					"$lt": "2018-06-14 09:00:00"
				},
				
			},
			sort: [{"timestamp": "desc"}]
		}),
		table:'webhook_all',
		prev: true*/
	});
});

module.exports = router;
