
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	console.log(req.params);
	console.log(req.query);
	res.render('fb_query', {
	//res.render('index', {
		title: 'fb_query_messages',
		item_id: req.query.conversation,
		type: 'messages',
		fields: 'message,attachments,created_time,to,from'
	});
});

module.exports = router;
