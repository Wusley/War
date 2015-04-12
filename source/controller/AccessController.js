module.exports = function( router, interceptAccess, userDao, authDao ) {

  // DEPENDENCIEs
  var authValidator = require( '../service/authValidator' ),
      treatResponse = require( '../service/treatResponse' ),
      config = require( '../config/user' );

  router.post( '/connect', function( req, res, next ) {

    var response = treatResponse( res ),
        errors = authValidator( req );

    if( !errors ) {

      userDao.authenticate( req.body.email, req.body.password, { 'success': function( data ) {

        authDao.save( data.user.nick, response );

      }, 'fail': response.fail } );

    } else {

      response.fail( { 'errors': errors } );

    }

  } );

  router.get( '/disconnect/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var token = req.params.token,
        response = treatResponse( res );

    delete req.session.nick;

    authDao.delete( token, response );

  } );

};
