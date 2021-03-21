var express = require('express');
var router = express.Router();
const dataTier = require("../lib/dataTier");

/* GET data page. */
router.get('/', function(req, res, next) {
  res.render('survey');
});

// POST survey data to database
router.post('/submitForm', function(req,res) {
  // Get data from request
  var responseInfo = Object.keys(req.body).reduce(function (filtered, key) {
    if (req.body[key] != '0' && req.body[key] != '') filtered[key] = req.body[key];
    return filtered;
  }, {});
  // Save data in database
  dataTier.saveResponse(responseInfo, function(calendarID) {
      res.redirect('/');
  });
  
});

module.exports = router;
