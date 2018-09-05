var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('response_time_ytff');
  return ;
  console.log(req.query);
  
  if(req.query.old != null){
	res.render('line_manage_web_old');
  }else if(req.query.distinct_msg != null){
    res.render('line_manage_web_distinct_msg');
  }else if(req.query.usagelinechart != null){
    res.render('usagelinechart');
  }else if(req.query.usagelinechart_fadeout != null){
    res.render('usagelinechart_fadeout');
  }else if(req.query.usagelinechart_detail != null){
    res.render('usagelinechart_detail');
  }else{
	res.render('line_manage_web', { title: 'line_manage_web' });
  }
  
});

module.exports = router;
