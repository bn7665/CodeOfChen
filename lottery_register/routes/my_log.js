var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log("my_log_body");
  console.log(req.headers);
  console.log(req.body);
  res.send('That"s Ok');
  
});

module.exports = router;
