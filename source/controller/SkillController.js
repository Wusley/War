module.exports = function( router, mongoose, cache, uuid ) {

  // DEPENDENCIES
  var SkillDao = require( '../dao/SkillDAO' );

  var skillDao = new SkillDao( mongoose );

  router.post( '/skill', function( req, res, next ) {

    var client = {};

    function success( skill ) {
      client.cod = 200;
      client.skill = skill;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.skill = null;

      if( status === 'skill' ) {

        client.skill = false;

      }

      res.send( client );
    }

    skillDao.save( req.body, success, fail );

  } );

  router.get( '/skills', function( req, res, next ) {

    var client = {},
        promise = skillDao.findList();

    function success( skills ) {
      client.cod = 200;
      client.skills = skills;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.skills = null;

      if( status === 'skills' ) {

        client.skills = false;

      }

      res.send( client );
    }

    promise.then( function( skills ) {

      if( skills ) {

        success( skills );

      } else {

        fail( 'skills' );

      }

      console.log( skills );

    } );

  } );

};
