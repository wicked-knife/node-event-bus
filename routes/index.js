var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(
    {
      "name": "Cristian",
      "last_name": "García",
      "age": 26,
      "email": "1"
    }
  )
});

module.exports = router;
