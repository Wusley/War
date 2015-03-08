module.exports = function( router, mongoose, cache, uuid, userDao, partyDao ) {

  // DEPENDENCIES
  var positionValidator = require( '../service/positionValidator' ),
      InterceptAccess = require( '../interceptor/interceptAccess' );

  var interceptAccess = new InterceptAccess( cache );

  router.post('/position', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {},
        errors = positionValidator( req );

    function success( nick, position ) {

      client.cod = 200;
      client.position = true;
      client.party = null;

      function _success() {

        client.cod = 200;
        client.party = true;

        res.send( client );

      }

      function _false( status, errors ) {

        client.cod = 400;
        client.errors = errors;
        client.user = null;
        client.party = null;
        client.haveParty = null;

        if( status === 'user' ) {

          client.user = false;

        }

        if( status === 'party' ) {

          client.party = false;

        }

        if( status === 'partyExist' ) {

          client.haveParty = true;

        }

        res.send( client );

      }

      var promise =  partyDao.findPartyUser( nick );

      promise.then( function( data ) {

        if( !data ) {

          var promise = userDao.findUserNearby( position, nick );

          promise
            .then( function( users ) {

              if( users ) {

                var id, _users = [];
                for( id in users ) {

                  if( users.hasOwnProperty( id ) ) {

                    _users.push( users[ id ].nick );

                  }

                }

                var promise = partyDao.findAvaliableParty( _users, nick );

                promise.then( function( party ) {

                  if( party ) {

                    var promise = partyDao.insertPartner( party._id, nick );

                    promise.then( function( party ) {

                      if( party ) {

                        _success();

                      } else {

                        _false( 'party' );

                      }

                    } );

                  } else {

                    var promise = partyDao.createParty( nick );

                    promise.then( function( party ) {

                      if( party ) {

                        _success();

                      } else {

                        _false( 'party' );

                      }

                    } );

                  }

                } );

              } else {

                _false( 'user' );

              }

            } );

        } else {

          _false( 'partyExist' );

        }

      } );

      res.send( client );

    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;

      res.send( client );
    }

    if( !errors ) {

      userDao.updatePosition( nick, req.body.latitude, req.body.longitude, success, fail );

    } else {

      fail( 'errors', errors );

    }

  } );

  router.get( '/position/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {},
        promiseParty = partyDao.findPartyUser( nick );

    function success( partners ) {
      client.cod = 200;
      client.nick = nick;
      client.partners = partners;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.party = null;
      client.partners = null;

      if( status === 'partners' ) {

        client.partners = false;

      }

      if( status === 'party' ) {

        client.party = false;

      }

      res.send( client );
    }

    promiseParty
      .then( function( party ) {

        if( party ) {

          var promiseUsers = userDao.findList( party.partners );

          promiseUsers.then( function( users ) {

            if( users ) {

              success( users );

            } else {

              fail( 'partners' );

            }

          } );

        } else {

          fail( 'party' );

        }



      } );

    // promise
    //   .then( function( user ) {

    //     if( user.position ) {

    //       success( {
    //         'lat': user.position[ 0 ],
    //         'lng': user.position[ 1 ]
    //       } );

    //     } else {

    //       fail( 'position' );

    //     }

    //   } );

  } );

};
