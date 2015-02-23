module.exports = ( function() {

  var InterceptAcess = function( cache ) {

    var moment = require('moment');

    return {
      checkConnected: function( req, res, next ) {

        var token = req.body.token || req.params.token;

        cache
          .hgetall( token, function( error, session ) {

            if( !error && moment().diff( session.expires ) < 0 ) {

              req.session = { nick: session.nick };

            } else {

              req.session = { nick: false };

            }

            next();

          } );

      }

    };

  };

  return InterceptAcess;

} () );