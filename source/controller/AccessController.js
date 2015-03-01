module.exports = function( router, mongoose, cache, uuid, userDao ) {

  // DEPENDENCIES
  var emailValidator = require( '../service/emailValidator' ),
      InterceptAccess = require( '../interceptor/interceptAccess' ),
      moment = require('moment');

  var interceptAccess = new InterceptAccess( cache );

  router.post( '/connect', function( req, res, next ) {

    var client = {},
        errors = emailValidator( req );

    function success( user ) {

      function _success( token ) {

        client.cod = 200;
        client.token = token;

        res.send( client );

      }

      function _fail( status, errors ) {

        client.cod = 400;
        client.errors = errors || null;

        res.send( client );

      }

      var data = {
        token: user.nick + ':' + uuid.v1(),
        nick: user.nick,
        expires: moment().add( 1, 'day' )
      };

      cache
        .hmset( data.token, { nick: data.nick, expires: data.expires }, function( error, session ) {

          if( !error ) {

            _success( data.token );

          } else {

            _fail();

          }

        } );

    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.user = null;
      client.user = null;
      client.password = null;

      if( status === 'user' ) {

        client.user = false;

      }

      if( status === 'password' ) {

        client.password = false;

      }

      res.send( client );
    }

    if( !errors ) {

      userDao.authenticate( req.body.email, req.body.password, success, fail );

    } else {

      fail( 'errors', errors );

    }


  } );

  router.get( '/disconnect/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var token = req.params.token,
        client = {};

    delete req.session.nick;

    function success() {
      client.cod = 200;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;

      if( status === 'server' ) {

        client.cod = 500;

      }

      res.send( client );
    }

    cache
      .del( 'session.' + token,
          function ( error, session ) {

            if( !error ) {

              success();

            } else {

              fail( 'server' );

            }

          } );

  } );

};
