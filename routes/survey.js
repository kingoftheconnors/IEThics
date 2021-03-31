var express = require('express');
var router = express.Router();
const dataTier = require("../lib/dataTier");
var CryptoJS = require("crypto-js");

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
  var encodingKey = "example";
  if(process.env.RESULTS_ENCODER_KEY) {
    encodingKey = process.env.RESULTS_ENCODER_KEY
  } else {
    try {
      encodingKey = require('./config')['encoding_key'];
    }
    catch (e) {
      console.log("WARNING: No config file or database found. Encoded url will not match on-app version");
    }
  }
  dataTier.saveResponse(responseInfo, function(responseID) {
    var responseKey = CryptoJS.AES.encrypt(responseID.toString(), encodingKey)
    res.redirect('/survey/results/' + responseKey);
  });
  
});

router.get('/results/:id', function(req, res, next) {
  // Decode id in database
  var encodingKey = "example";
  if(process.env.RESULTS_ENCODER_KEY) {
    encodingKey = process.env.RESULTS_ENCODER_KEY
  } else {
    try {
      encodingKey = require('./config')['encoding_key'];
    }
    catch (e) {
      console.log("WARNING: No config file or database found. Encoded url will not match on-app version");
    }
  }
  var bytes = CryptoJS.AES.decrypt(req.params.id, encodingKey);
  var responseID = bytes.toString(CryptoJS.enc.Utf8);
  dataTier.getResponse(responseID, function(responseData) {
    // Create reponse info:
    // 1. Array of values
    var values = [
      {name: "Product Quality", specifier: "qa"}, // Quality Assurance
      {name: "Helping Coworkers", specifier: "hc"}, 
      {name: "Intellectual Property", specifier: "ip"},
      {name: "Privacy",  specifier: "pr"}, 
      {name: "Transparency to Clients", specifier: "tttc"}
    ]
    // 2. Array of relations. Relations are dicts: {from: IP, to: QA, text: "words", isArrow: true}
    console.log(responseData)
    var relations = []
    values.forEach(function(valueOne, index) {
      values.forEach(function(valueTwo, index) {
        var relationName = valueOne.specifier + "v" + valueTwo.specifier
        if(("text" + relationName) in responseData) {
          var newRelation = {
            text: responseData["text" + relationName]
          }
          if(responseData["winner" + relationName].toUpperCase() == valueOne.specifier.toUpperCase()) {
            newRelation.from = valueOne.specifier;
            newRelation.to = valueTwo.specifier;
            newRelation.isArrow = true;
          } else if(responseData["winner" + relationName].toUpperCase() == valueTwo.specifier.toUpperCase()) {
            newRelation.from = valueTwo.specifier;
            newRelation.to = valueOne.specifier;
            newRelation.isArrow = true;
          } else {
            newRelation.from = valueOne.specifier;
            newRelation.to = valueTwo.specifier;
            newRelation.isArrow = false;
          }
          relations.push(newRelation);
        }
      })
    })
    console.log(relations);
    res.render('results', { values: values, relations: relations});
  });
});

module.exports = router;
