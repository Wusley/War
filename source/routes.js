
  // Config routes
  var express = require('express'),
      mongoose = require( 'mongoose' ),
      router = express.Router();

  mongoose.connect( 'mongodb://nodejitsu:094f15dc574844069237d968fef6fb64@troup.mongohq.com:10077/nodejitsudb4669245437' );

  require('./controller/UserController')( router, mongoose );

  module.exports = router;
