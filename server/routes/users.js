var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({name:"Aaron", password:"hehexd"});
});

router.get('/createUser', function(req, res, next) {
  res.send(' Creating User!');
});

module.exports = router;
