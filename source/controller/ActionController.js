module.exports = function( router, interceptAccess ) {

  // DEPENDENCIEs

  router.post( '/attack/:token', interceptAccess.checkConnected, function( req, res, next ) {



  } );

  router.post( '/defense/:token', interceptAccess.checkConnected, function( req, res, next ) {



  } );

  router.get( '/active/:token', function( req, res, next ) {

    //

  } );

};
