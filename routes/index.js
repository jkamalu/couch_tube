var express = require('express'),
    path = require('path')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index')
})

module.exports = router
