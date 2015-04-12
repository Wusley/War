module.exports = function( res ) {

  var _ = require( 'underscore' );

  var Response = function() {

    var client = {};

    return {
      success: function( data ) {

        client.cod = 200;

        if( data ) {

          client = _.extend( client, data );

        }

        res.send( client );

      },
      fail: function( data ) {

        client.cod = 400;

        if( data ) {

          if( _.isString( data ) ) {

            client[ data ] = false;

          } else {

            client = _.extend( client, data );

          }

        }

        res.send( client );

      }
    };

  };

  return new Response;

};