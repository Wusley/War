  // Config routes
  var express = require( 'express' ),
      mongodbConfig = require( './config/mongodb' ),
      redisConfig = require( './config/redis' ),
      Schedule = require( './service/schedule' ),
      JobCompose = require( './service/jobCompose' ),
      mongoose = require( 'mongoose' ),
      redis = require( 'redis' ),
      uuid = require( 'node-uuid' ),
      cache = {},
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

  var jobCompose = new JobCompose( jobDao, skillDao );

  jobCompose.list( success, fail );

  function success( data ) {

    cache.jobs = data;

    require( './controller/UserController' )( router, interceptAccess, userDao, partyDao );
    require( './controller/AccessController' )( router, redis, uuid, interceptAccess, userDao );
    require( './controller/PositionController' )( router, interceptAccess, cache, userDao, partyDao );
    require( './controller/PartyController' )( router, interceptAccess, userDao, partyDao );
    require( './controller/JobController' )( router, jobDao );
    require( './controller/SkillController' )( router, interceptAccess, cache, skillDao, userDao );
    require( './controller/ActionController' )( router, interceptAccess );

  }

  function fail() {



  }

  module.exports = router;
