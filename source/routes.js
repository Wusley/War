  // Config routes
  var express = require( 'express' ),
      mongodbConfig = require( './config/mongodb' ),
      redisConfig = require( './config/redis' ),
      Schedule = require( './service/Schedule' ),
      mongoose = require( 'mongoose' ),
      redis = require( 'redis' ),
      uuid = require( 'node-uuid' ),
      router = express.Router();

  mongoose.connect( mongodbConfig.connect );

  redis = redis.createClient( redisConfig.port, redisConfig.host, { auth_pass: redisConfig.pass } );

  redis
    .on( 'connect', function() {

      // console.log( 'connected' );

    } );

  redis
    .on( 'error', function( err ) {

        console.log( err );

    } );

  // var schedule = new Schedule();

  // schedule.start( 1000, check );

  // function check( id ) {

  //   console.log( id );

  // }

  // DEPENDENCIEs
  var UserDao = require( './dao/UserDAO' ),
      PartyDao = require( './dao/PartyDAO' ),
      JobDao = require( './dao/JobDAO' ),
      SkillDao = require( './dao/SkillDAO' ),
      InterceptAccess = require( './interceptor/interceptAccess' );

  // INSTANCES
  var userDao = new UserDao( mongoose ),
      partyDao = new PartyDao( mongoose ),
      jobDao = new JobDao( mongoose ),
      skillDao = new SkillDao( mongoose ),
      interceptAccess = new InterceptAccess( redis );

  require( './controller/UserController' )( router, interceptAccess, userDao, partyDao );
  require( './controller/AccessController' )( router, redis, uuid, interceptAccess, userDao );
  require( './controller/PositionController' )( router, interceptAccess, userDao, partyDao );
  require( './controller/PartyController' )( router, interceptAccess, userDao, partyDao );
  require( './controller/JobController' )( router, jobDao );
  require( './controller/SkillController' )( router, skillDao );
  require( './controller/ActionController' )( router, interceptAccess );

  module.exports = router;
