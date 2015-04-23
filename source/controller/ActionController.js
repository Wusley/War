module.exports = function( router, interceptAccess, schedule, actionDao, userDao, partyDao ) {

  // DEPENDENCIEs
  var handleNewAttack = require( '../service/handleNewAttack' ),
      attackValidator = require( '../service/attackValidator' ),
      treatAction = require( '../service/treatAction' ),
      treatResponse = require( '../service/treatResponse' ),
      castTime = require( '../service/castTime' ),
      sliceActions = require( '../service/sliceActions' ),
      moment = require( 'moment' );

  router.post( '/attack', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        errors = attackValidator( req );

    if( !errors ) {

      handleNewAttack( nick, req.body, userDao, partyDao, { 'success': function ( data ) {

        var user = data.user,
            target = data.target,
            title = data.title,
            actSouls = data.actSouls,
            souls = data.souls,
            skills = data.skills;

        var distance = parseFloat( target.dis.toFixed( 3 ) ) * 1000; // convert km in meters

        var action = {
          'title': title,
          'distance': distance, // meters
          'date': moment(), // date
          'schedule': moment().add( castTime( distance ), 'minutes' ), // schedule
          'attack': {
            'nick': user.nick,
            'position': user.position
          },
          'target': { // target
            'nick': target.obj.nick,
            'position': target.obj.position
          },
          'atks': [ { 'nick': user.nick, 'souls': actSouls, 'skills': skills } ] // list attackers
        };

        var promiseAction = actionDao.saveAttack( action, { 'success': function ( data ) {

          var action = data.action;

          var promiseUser = userDao.updatePay( user.nick, ( user.souls - souls ) );

          promiseUser.then( function( user ) {

            if( user ) {

              schedule
                .add( treatAction( action ) );

              response.success( action );

            } else {

              response.fail( 'user-broke' );

            }

          } );

        }, 'fail': response.fail } );

      }, 'fail': response.fail } );

    } else {

      response.fail( { 'errors': errors } );

    }

  } );

  router.get( '/action/enemy/:id/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        id = req.params.id,
        response = treatResponse( res ),
        promiseUser = userDao.findUser( nick ),
        promiseEnemy = userDao.findId( id );

    promiseUser
      .then( function( user ) {

        if( user ) {

          promiseEnemy
            .then( function( enemy ) {

              if( enemy ) {

                // Handle Data
                response.success( { 'user': user, 'enemy': enemy } );

              } else {

                response.fail( 'server' );

              }

            } );

        } else {

          response.fail( 'empty-user' );

        }

      } );

  } );

  router.get( '/action/line/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res );

    var promiseAction = actionDao.findActionsUser( nick );

    promiseAction
      .then( function( actions ) {

        if( actions ) {

          var line = sliceActions( nick, actions );

          response.success( { 'line': line } );

        } else {

          response.fail( 'empty-action' );

        }

      } );

  } );

  router.get( '/action/partner/line/:id/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        id = req.params.id,
        response = treatResponse( res ),
        promiseTarget = userDao.findId( id );

        promiseTarget
          .then( function( target ) {

            if( target ) {

              var promiseAction = actionDao.findActionsUser( target.nick );

              promiseAction
                .then( function( actions ) {

                  if( actions ) {

                    var promiseParty = partyDao.findTargetInParty( nick, target.nick );

                    promiseParty.then( function( party ) {

                      if( party.length === 1 ) {

                        var line = sliceActions( target.nick, actions );

                        // limitar line target
                        // remove properties

                        response.success( { 'line': line } );

                      } else if( party.length > 0 ) {

                        response.fail( 'not-partners' );

                      } else {

                        response.fail( 'server' );

                      }

                    } );

                  } else {

                    response.fail( 'empty-action' );

                  }

                } );

            } else {

              response.fail( 'empty-target' );

            }

          } );

  } );

  router.get( '/action/enemy/line/:id/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        id = req.params.id,
        response = treatResponse( res ),
        promiseUser = userDao.findUser( nick );

        promiseUser
          .then( function( user ) {

            if( user ) {

              var promiseTarget = userDao.findEnemyIdNearbyLimit( id, user.position, user.job.sight );

              promiseTarget
                .then( function( target ) {

                  if( target.length === 1 ) {

                    target = target[ 0 ];

                    var promiseAction = actionDao.findActionsUser( target.nick );

                    promiseAction
                      .then( function( actions ) {

                        if( actions ) {

                          var promiseParty = partyDao.findTargetInParty( nick, target.nick );

                          promiseParty.then( function( party ) {

                            if( party.length === 0 ) {

                              var line = sliceActions( target.nick, actions, 'enemy' );

                              // limitar line target
                              // remove properties

                              response.success( { 'line': line } );

                            } else if( party.length > 0 ) {

                              response.fail( 'partners' );

                            } else {

                              response.fail( 'server' );

                            }

                          } );

                        } else {

                          response.fail( 'empty-action' );

                        }

                      } );

                  } else {

                    response.fail( 'empty-target' );

                  }

                } );
            }

          } );

  } );

};
