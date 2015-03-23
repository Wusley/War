module.exports = function( router, interceptAccess, userDao ) {

  // DEPENDENCIEs

  router.post( '/attack', interceptAccess.checkConnected, function( req, res, next ) {
    var nick = req.session.nick,
        client = {};
        //valida dados atacado e atacante

    // pega dados do db
    // subtrai dados do db com client, resultado volta pro db. dados client armazena em forma de ataque no doc action

  } );

  router.put( '/attack/:id', interceptAccess.checkConnected, function( req, res, next ) {
    var nick = req.session.nick,
        client = {};
        //valida dados atacado e atacante

    // pega dados do db
    // subtrai dados do db com client, resultado volta pro db. dados client armazena em forma de ataque no doc action

  } );

  router.get( '/action/enemy/:id/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        id = req.params.id,
        client = {},
        promiseUser = userDao.findUser( nick );
        promiseEnemy = userDao.findId( id );

    function success( user, enemy ) {
      client.cod = 200;
      client.user = user;
      client.enemy = enemy;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.user = null;
      client.enemy = null;

      if( status === 'user' ) {

        client.user = false;

      }

      if( status === 'enemy' ) {

        client.enemy = false;

      }

      res.send( client );
    }

    promiseUser
      .then( function( user ) {

        if( user ) {

          promiseEnemy
            .then( function( enemy ) {

              if( enemy ) {

                // Handle Data
                success( user, enemy );

              } else {

                fail( 'enemy' );

              }

            } );

        } else {

          fail( 'user' );

        }

      } );

  } );

  router.post( '/attack/:token', interceptAccess.checkConnected, function( req, res, next ) {



  } );

  router.post( '/defense/:token', interceptAccess.checkConnected, function( req, res, next ) {



  } );

  router.get( '/active/:token', function( req, res, next ) {

    //

  } );

};
