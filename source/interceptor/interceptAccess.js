module.exports = ( function() {

  var InterceptAcess = function( redis ) {

    var moment = require('moment');

    return {
      checkConnected: function( req, res, next ) {

        var token = req.body.token || req.params.token;

        redis
          .hgetall( token, function( error, session ) {

            if( session && moment().diff( new Date( session.expires ) ) < 0 ) {

              req.session = { nick: session.nick };
              next();

            } else {

              res.send( { 'cod': 401 } );

            }

          } );

      }

    };

  };

  return InterceptAcess;

} () );