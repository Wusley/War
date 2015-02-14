
  // Config routes

  var express = require('express');
  var router = express.Router();

  require('./controller/user')( router );

  module.exports = router;

