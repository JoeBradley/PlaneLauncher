var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  const users = [
    { name: 'Chris' },
    { name: 'Adam' }
  ];
  
  res.send(users);
});

module.exports = router;
