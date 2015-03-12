module.exports = function( router, interceptAccess, userDao, partyDao ) {

  router.get('/party/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {},
        promise = partyDao.findPartyUser( nick );

    function success( party ) {
      client.cod = 200;
      client.party = party;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.party = null;

      if( status === 'party' ) {

        client.party = false;

      }

      res.send( client );
    }

    promise
      .then( function( party ) {

        if( party ) {

          // Handle Data
          success( {
            'name': party.name,
            'description': party.description,
            'partners': party.partners,
            'score': party.score
          } );

        } else {

          fail( 'party' );

        }

      } );

  } );

};
