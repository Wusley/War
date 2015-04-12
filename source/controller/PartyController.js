module.exports = function( router, interceptAccess, partyDao ) {

  var treatResponse = require( '../service/treatResponse' );

  router.get('/party/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        promise = partyDao.findPartyUser( nick );

    promise
      .then( function( party ) {

        if( party ) {

          // Handle Data
          response.success( {
            'name': party.name,
            'description': party.description,
            'partners': party.partners,
            'score': party.score
          } );

        } else {

          response.fail( 'empty' );

        }

      } );

  } );

};
