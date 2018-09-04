
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('fb_query', {
		title: 'fb_query_conversations',
		item_id: '248954465174600',
		type: 'conversations',
		fields:'id,link,snippet,updated_time,message_count,unread_count,participants,senders,can_reply,is_subscribed'
	});
});

module.exports = router;
