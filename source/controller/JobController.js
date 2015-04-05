module.exports = function( router, jobDao ) {

  // DEPENDENCIEs
  var treatSkills = require( '../service/treatSkills' );

  router.post( '/job', function( req, res, next ) {

    var client = {};

    function success( data ) {
      client.cod = 200;
      client.job = data;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.job = null;

      if( status === 'job' ) {

        client.job = false;

      }

      res.send( client );
    }

    console.log(req.body);

    jobDao.save( req.body, success, fail );

  } );

  router.get( '/jobs', function( req, res, next ) {

    var client = {},
        promise = jobDao.findList();

    function success( jobs ) {
      client.cod = 200;
      client.jobs = jobs;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.jobs = null;

      if( status === 'jobs' ) {

        client.jobs = false;

      }

      res.send( client );
    }

    promise.then( function( jobs ) {

      if( jobs ) {

        success( jobs );

      } else {

        fail( 'jobs' );

      }

    } );

  } );


  router.put( '/job/skills', function( req, res, next ) {

    var client = {};
        req.body.skills = treatSkills( req.body.skills );

    function success( job ) {
      client.cod = 200;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.skills = null;

      if( status === 'skills' ) {

        client.job = false;

      }

      res.send( client );
    }

    jobDao.updateJobSkill( req.body.name, req.body.skills, success, fail );

  } );

};
