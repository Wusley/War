
  // Config routes
  var express = require( 'express' ),
      mongodbConfig = require( './config/mongodb' ),
      redisConfig = require( './config/redis' ),
      mongoose = require( 'mongoose' ),
      uuid = require( 'node-uuid' ),
      router = express.Router();

  mongoose.connect( mongodbConfig.connect );

  var redis = require('redis').createClient( redisConfig.port, redisConfig.host, { auth_pass: redisConfig.pass } );

  require( './controller/UserController' )( router, mongoose, redis, uuid );

  module.exports = router;
