var express = require('express');
var router = express.Router();

const dataTier = require("../lib/dataTier");

/*
// GET calendar search
router.get('/', function(req, res, next) {
  // If an extension is noted, call it by id
  var searchTerm = req.param('searchterm') || ''
  dataTier.searchCalendarsByName(searchTerm, function(calendarData) {
    res.render('search',
    {
      calendars: calendarData
    });
  })
});*/

module.exports = router;
