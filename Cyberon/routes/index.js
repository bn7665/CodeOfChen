var express = require('express'); var router = express.Router(); /* GET home 
page. */ router.get('/', function(req, res, next) {
  res.render('index', {
	title: 'Welcome Guys!~',
	says:'This is "CyberonRelated".'
  });
});
module.exports = router;
