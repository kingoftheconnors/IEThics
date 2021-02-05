var express = require('express');
var router = express.Router();

const dataTier = require("../lib/dataTier");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
