module.exports = function( router, interceptAccess, userDao, partyDao ) {

  // DEPENDENCIEs
  var mapConfig = require( '../config/map' ),
      treatResponse = require( '../service/treatResponse' ),
      positionValidator = require( '../service/positionValidator' );

  router.get( '/map/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var response = treatResponse( res );

    response.success( { 'map': { 'limit-position': mapConfig[ 'limit-position' ] } } );

  } );

  router.post( '/position', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        errors = positionValidator( req );

    if( !errors ) {

      userDao.updatePosition( nick, req.body.latitude, req.body.longitude, { 'success': function( data ) {

        var nick = data.nick,
            position = data.position;

        var promise =  partyDao.findPartyUser( nick );

        promise.then( function( party ) {

          if( !party ) {

            var promise = userDao.findUserNearby( position, nick );

            promise
              .then( function( users ) {

                if( users ) {

                  var id,
                      _users = [];
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

                          response.success( party );

                        } else {

                          response.fail( 'server' );

                        }

                      } );

                    } else {

                      partyDao.createParty( nick, response );

                    }

                  } );

                } else {

                  response.fail( 'empty-users' );

                }

              } );

          } else {

            response.fail( 'party-user-exist' );

          }

        } );

      }, 'fail': response.fail } );

    } else {

      response.fail( { 'errors': errors } );

    }

  } );

  router.get( '/position/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        promiseParty = partyDao.findPartyUser( nick );

    promiseParty
      .then( function( party ) {

        var user,
            exceptPartners = [],
            partners = [],
            enemies = [];

        if( party ) {

          var promiseUsers = userDao.findList( party.partners );

          promiseUsers.then( function( users ) {

            if( users ) {

              var id = 0,
                  usersLength = users.length;
              for( ; id < usersLength; id = id + 1 ) {

                exceptPartners.push( users[ id ].nick );

                if( users[ id ].nick !== nick ) {

                  partners.push( users[ id ] );

                } else {

                  user = users[ id ];

                }

              }

              var promiseEnemies = userDao.findEnemyNearby( user.position, user.job.sight, exceptPartners );

              promiseEnemies.then( function( enemies ) {

                if( enemies ) {

                  response.success( { 'user': user, 'partners': partners, 'enemies': enemies } );

                } else {

                  response.success( { 'user': user, 'partners': partners } );

                }

              } );

            } else {

              response.fail( 'empty-partners' );

            }

          } );

        } else {

          response.fail( 'empty-party' );

        }

      } );

  } );

};
