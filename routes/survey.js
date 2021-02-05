var express = require('express');
var router = express.Router();
const dataTier = require("../lib/dataTier");

/* GET data page. */
router.get('/', function(req, res, next) {
  res.render('survey');
});

/*
// POST survey data to database
router.post('/', function(req,res) {
  // Get data from request
  var calendarInput = JSON.parse(req.body.calendarData);
  var calendarName = req.body.calendarName;

  // Save data in database
  dataTier.saveCalendar(calendarInput, calendarName, function(calendarID) {
      res.redirect('/');
  });
  
});*/

module.exports = router;
