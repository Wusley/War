  // Config routes
  var express = require( 'express' ),
      mongodbConfig = require( './config/mongodb' ),
      redisConfig = require( './config/redis' ),
      Schedule = require( './service/schedule' ),
      JobCompose = require( './service/jobCompose' ),
      mongoose = require( 'mongoose' ),
      redis = require( 'redis' ),
      cache = {},
      router = express.Router();

  // add function type in mongoose
  require( 'mongoose-function' )( mongoose );

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

  // DEPENDENCIEs
  var JobDao = require( './dao/JobDAO' ),
      SkillDao = require( './dao/SkillDAO' );

  // INSTANCES
  var jobDao = new JobDao( mongoose ),
      skillDao = new SkillDao( mongoose );

  var jobCompose = new JobCompose( jobDao, skillDao );

  jobCompose.list( success, fail );

  var schedule = new Schedule();

  function success( data ) {

    cache.jobs = data;

    // DEPENDENCIEs
    var UserDao = require( './dao/UserDAO' ),
        PartyDao = require( './dao/PartyDAO' ),
        ActionDao = require( './dao/ActionDAO' ),
        AuthDao = require( './dao/AuthDAO' ),
        InterceptAccess = require( './interceptor/interceptAccess' );

    // INSTANCES
    var userDao = new UserDao( mongoose, cache ),
        partyDao = new PartyDao( mongoose ),
        actionDao = new ActionDao( mongoose ),
        authDao = new AuthDao( redis ),
        interceptAccess = new InterceptAccess( redis );

    var promise = schedule.start( 3000, userDao, actionDao );

    promise
      .then( function() {

        require( './controller/UserController' )( router, interceptAccess, userDao, partyDao );
        require( './controller/AccessController' )( router, interceptAccess, userDao, authDao );
        require( './controller/PositionController' )( router, interceptAccess, userDao, partyDao );
        require( './controller/PartyController' )( router, interceptAccess, partyDao );
        require( './controller/JobController' )( router, jobDao );
        require( './controller/SkillController' )( router, interceptAccess, schedule, skillDao, userDao );
        require( './controller/ActionController' )( router, interceptAccess, schedule, actionDao, userDao, partyDao );

      } );

  }

  function fail() {

  }

  module.exports = router;
