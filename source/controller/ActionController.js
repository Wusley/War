module.exports = function( router, interceptAccess, schedule, actionDao, userDao, partyDao ) {

  // DEPENDENCIEs
  var handleNewAttack = require( '../service/handleNewAttack' ),
      attackValidator = require( '../service/attackValidator' ),
      treatAction = require( '../service/treatAction' ),
      treatResponse = require( '../service/treatResponse' ),
      castTime = require( '../service/castTime' ),
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

  router.get( '/action/enemy/line/:id/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        id = req.params.id,
        response = treatResponse( res ),
        promiseEnemy = userDao.findId( id );

        promiseEnemy
          .then( function( enemy ) {

            if( enemy ) {

              var promiseAction = actionDao.findActionsUser( enemy.nick );

              promiseAction
                .then( function( action ) {

                  if( action ) {

                    // sortActions
                    // treatEnemyLine
                    response.success();

                  } else {

                    response.fail( 'empty-action' );

                  }

                } );

            } else {

              response.fail( 'empty-enemy' );

            }

          } );

  } );

};
