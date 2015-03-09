
  // Config routes
  var express = require( 'express' ),
      mongodbConfig = require( './config/mongodb' ),
      redisConfig = require( './config/redis' ),
      mongoose = require( 'mongoose' ),
      uuid = require( 'node-uuid' ),
      router = express.Router();

  mongoose.connect( mongodbConfig.connect );

  var redis = require('redis').createClient( redisConfig.port, redisConfig.host, { auth_pass: redisConfig.pass } );

  redis
    .on( 'connect', function() {

        console.log( 'connected' );

    } );

  redis
    .on( 'error', function( err ) {

        console.log( err );

    } );


  require( './controller/UserController' )( router, mongoose, redis, uuid );
  require( './controller/JobController' )( router, mongoose, redis, uuid );
  require( './controller/SkillController' )( router, mongoose, redis, uuid );

  module.exports = router;
