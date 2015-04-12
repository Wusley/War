module.exports = function( router, jobDao ) {

  // DEPENDENCIEs
  var treatSkills = require( '../service/treatSkills' ),
      treatResponse = require( '../service/treatResponse' );

  router.post( '/job', function( req, res, next ) {

    var response = treatResponse( res );

    jobDao.save( req.body, response );

  } );

  router.get( '/jobs', function( req, res, next ) {

    var response = treatResponse( res ),
        promise = jobDao.findList();

    promise
      .then( function( jobs ) {

        if( jobs ) {

          response.success( { 'jobs': jobs } );

        } else {

          response.fail( 'empty' );

        }

      } );

  } );

  router.put( '/job/skills', function( req, res, next ) {

    var response = treatResponse( res ),
        skills = treatSkills( req.body.skills );

    jobDao.updateJobSkill( req.body.name, skills, response );

  } );

};
