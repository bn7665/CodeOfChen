
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	if(req.query.conversation!=null){
		res.render('fb_query_hotai', {
			title: 'fb_query_messages',
			item_id: req.query.conversation,
			type: 'messages',
			fields: 'message,attachments,created_time,to,from'
		});
	
	}else if(req.query.type=="conversation"){
		res.render('fb_query_hotai', {
			title: 'fb_query_conversations',
			item_id: '248954465174600',
			type: 'conversations',
			fields:'id,link,snippet,updated_time,message_count,unread_count,participants,senders,can_reply,is_subscribed'
		});
	}else{
		let title = "";
		title = req.query.type=="manager"?"提及 '小編' ":title;
		title = req.query.type=="over30"?"超過30字":title;
		
		title = req.query.type=="pic"?"傳送圖片":title;
		title = req.query.type=="statistic"?"統計數字":title;
		
		res.render('index', { 
			title: title,
			query_template : JSON.stringify({
				"selector": {
					"type": {
						"$eq": "SendMessages"
					}
				},
				"timestamp": {
					"$gt": new Date(new Date().getTime()-1000*3600*24*3),
				},
				sort: [{"timestamp": "desc"}]
			}),
			table:'normal_statistic',
			prev:false
		});
		
	}
});

module.exports = router;
