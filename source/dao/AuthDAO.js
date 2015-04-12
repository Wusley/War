module.exports = ( function() {

  var moment = require('moment'),
      uuid = require( 'node-uuid' );

  var AuthDAO = function( redis ) {

    return {
      save: function( nick, response ) {

        var data = {
          token: nick + ':' + uuid.v1(),
          expires: moment().add( 1, 'day' )
        };

        redis
          .hmset( data.token, { nick: nick, expires: data.expires }, function( error, session ) {

            if( !error ) {

              response.success( { 'token': data.token } );

            } else {

              response.fail();

            }

          } );

      },
      delete: function( token, response ) {

        redis
          .del( 'session.' + token, function ( error, session ) {

            if( !error ) {

              response.success();

            } else {

              response.fail( 'server' );

            }

          } );

      }
    };

  };

  return AuthDAO;

} () );