module.exports = function( router, interceptAccess, schedule, actionDao, userDao, partyDao ) {

  // DEPENDENCIEs
  var handleNewAttack = require( '../service/handleNewAttack' ),
      checkRulesAction = require( '../service/checkRulesAction' ),
      attackValidator = require( '../service/attackValidator' ),
      compostActionValidator = require( '../service/compostActionValidator' ),
      treatAction = require( '../service/treatAction' ),
      treatResponse = require( '../service/treatResponse' ),
      castTime = require( '../service/castTime' ),
      sliceActions = require( '../service/sliceActions' ),
      restoreUserStatus = require( '../service/restoreUserStatus' ),
      moment = require( 'moment' ),
      _ = require( 'underscore' );

  // simple attack
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

        // dis = distancia em quilometros no formato do db
        // toFixed = metodo para alterar a posição da virgula
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
          'atks': [ { 'job': user.job.name, 'nick': user.nick, 'souls': actSouls, 'skills': skills } ] // list attackers
        };

        var promiseAction = actionDao.saveAttack( action, { 'success': function ( data ) {

          var action = data.action;

          var promiseUser = userDao.updatePay( user.nick, ( user.souls - souls ) );

          promiseUser.then( function( user ) {

            if( user ) {

              schedule
                .add( treatAction( action ) );

              response.success( { 'action': action } );

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

  // attack enemy
  router.post( '/attack/:actionId', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        errors = compostActionValidator( req ),
        promiseAction = actionDao.findActionId( req.params.actionId );

    if( !errors ) {

      promiseAction
        .then( function( action ) {

          if( action ) {

            var userAtk = _.findWhere( action.atks, { nick: nick } );

            if( !userAtk ) {

              var promiseParty = partyDao.findTargetInParty( nick, action.target.nick );

              promiseParty.then( function( party ) {

                if( party.length <= 0 ) {

                  var promiseUser = userDao.findNick( nick );

                  promiseUser.then( function( user ) {

                    if( user ) {

                      var data = checkRulesAction( user, req.body );

                      if( !data.error ) {

                        var promiseActionAttack = actionDao.updateActionAttack( req.params.actionId, { 'job': user.job.name, 'nick': user.nick, 'souls': req.body.souls, 'skills': data.skills } );

                        promiseActionAttack.then( function( actionUpdated ) {

                          if( actionUpdated ) {

                            var promiseUser = userDao.updatePay( user.nick, ( user.souls - data.souls ) );

                            promiseUser.then( function( user ) {

                              if( user ) {

                                response.success( { 'action': actionUpdated } );

                              } else {

                                response.fail( 'user-broke' );

                              }

                            } );

                          } else {

                            response.fail( 'error-attack' );

                          }

                        } );

                      } else {

                        response.fail( { 'errors': action.errors } );

                      }

                    } else {

                      response.fail( 'empty-user' );

                    }

                  } );

                } else {

                  response.fail( 'partners' );

                }

              } );

            } else {

              response.fail( 'attack-exist' );

            }

          }

        } );

    } else {

      response.fail( { 'errors': errors } );

    }

  } );

  // cancel attack
  router.delete( '/attack/cancel/:actionId', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        promiseAction = actionDao.findActionId( req.params.actionId );

    promiseAction
      .then( function( action ) {

        if( action ) {

          var atksLength = action.atks.length,
              user = _.findWhere( action.atks, { nick: nick } );

          if( user ) {

            var promiseActionAtk = {};

            if( atksLength > 1 ) {

              promiseActionAtk = actionDao.removeActionAttack( req.params.actionId, nick );

            } else {

              promiseActionAtk = actionDao.removeActionAttackAndCancel( req.params.actionId, nick );

            }

            promiseActionAtk.then( function( action ) {

              if( action ) {

                var promiseUser = userDao.updateUserStatus( nick, user.souls );

                promiseUser.then( function( user ) {

                  if( user ) {

                    response.success( { 'action': action, 'user': user } );

                  } else {

                    response.fail( 'user-not-restored' );

                  }

                } );

              } else {

                response.fail( 'action-not-updated' );

              }

            } );

          } else {

            response.fail( 'attack-not-exist' );

          }

        }

      } );

  } );

  // cancel defense partner
  router.delete( '/defense/cancel/:actionId', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        promiseAction = actionDao.findActionId( req.params.actionId );

    promiseAction
      .then( function( action ) {

        if( action ) {

          var user = _.findWhere( action.defs, { nick: nick } );

          if( user ) {

            var promiseActionRemoveDef = actionDao.removeActionDefense( req.params.actionId, nick );

            promiseActionRemoveDef.then( function( action ) {

              if( action ) {

                var promiseUser = userDao.updateUserStatus( nick, user.souls );

                promiseUser.then( function( user ) {

                  if( user ) {

                    response.success( { 'action': action, 'user': user } );

                  } else {

                    response.fail( 'user-not-restored' );

                  }

                } );

              } else {

                response.fail( 'action-not-updated' );

              }

            } );

          } else {

            response.fail( 'defense-not-exist' );

          }

        }

      } );

  } );

  // defense partner
  router.post( '/defense/:actionId', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        errors = compostActionValidator( req ),
        promiseAction = actionDao.findActionId( req.params.actionId );

    if( !errors ) {

      promiseAction
        .then( function( action ) {

          if( action ) {

            var userDef = _.findWhere( action.defs, { nick: nick } );

            if( !userDef ) {

              var promiseParty = partyDao.findTargetInParty( nick, action.target.nick );

              promiseParty.then( function( party ) {

                if( party.length > 0 ) {

                  var promiseUser = userDao.findNick( nick );

                  promiseUser.then( function( user ) {

                    if( user ) {

                      var data = checkRulesAction( user, req.body );

                      if( !data.error ) {

                        var promiseActionDefense = actionDao.updateActionDefense( req.params.actionId, { 'job': user.job.name, 'nick': user.nick, 'souls': req.body.souls, 'skills': data.skills } );

                        promiseActionDefense.then( function( actionUpdated ) {

                          if( actionUpdated ) {

                            var promiseUser = userDao.updatePay( user.nick, ( user.souls - data.souls ) );

                            promiseUser.then( function( user ) {

                              if( user ) {

                                response.success( { 'action': actionUpdated } );

                              } else {

                                response.fail( 'user-broke' );

                              }

                            } );

                          } else {

                            response.fail( 'error-defense' );

                          }

                        } );

                      } else {

                        response.fail( { 'errors': data.errors } );

                      }

                    } else {

                      response.fail( 'empty-user' );

                    }

                  } );

                } else {

                  response.fail( 'not-partners' );

                }

              } );

            } else {

              response.fail( 'defense-exist' );

            }

          }

        } );

    } else {

      response.fail( { 'errors': errors } );

    }

  } );

  router.get( '/action/enemy/:id/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        id = req.params.id,
        response = treatResponse( res ),
        promiseUser = userDao.findId( id );

    promiseUser
      .then( function( user ) {

        if( user ) {

          var promiseParty = partyDao.findTargetInParty( nick, user.nick );

          promiseParty.then( function( party ) {

            if( party.length <= 0 ) {

              // Handle Data
              response.success( { 'enemy': user } );

            } else {

              response.fail( 'partners' );

            }

          } );

        } else {

          response.fail( 'empty-enemy' );

        }

      } );

  } );

  router.get( '/attack/:actionId/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        actionId = req.params.actionId,
        response = treatResponse( res ),
        promiseAction = actionDao.findActionId( actionId );

    promiseAction
      .then( function( action ) {

        if( action ) {

          var promiseUser = userDao.findNick( action.target.nick );

          promiseUser
            .then( function( user ) {

              if( user ) {

                var promiseParty = partyDao.findTargetInParty( nick, action.target.nick );

                promiseParty.then( function( party ) {

                  if( party.length <= 0 ) {

                    // Handle Data
                    response.success( { 'enemy': user, 'action': action } );

                  } else {

                    response.fail( 'partners' );

                  }

                } );

              } else {

                response.fail( 'empty-user' );

              }

            } );

        } else {

          response.fail( 'empty-action' );

        }

      } );

  } );

  // counter attack
  router.get( '/counter-attack/:actionId/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        actionId = req.params.actionId,
        response = treatResponse( res ),
        promiseAction = actionDao.findActionId( actionId );

    promiseAction
      .then( function( action ) {

        if( action ) {

          var promiseUser = userDao.findNick( action.attack.nick );

          promiseUser
            .then( function( user ) {

              if( user ) {

                var promiseParty = partyDao.findTargetInParty( nick, action.attack.nick );

                promiseParty.then( function( party ) {

                  if( party.length <= 0 ) {

                    // Handle Data
                    response.success( { 'enemy': user } );

                  } else {

                    response.fail( 'partners' );

                  }

                } );

              } else {

                response.fail( 'empty-user' );

              }

            } );

        } else {

          response.fail( 'empty-action' );

        }

      } );

  } );

  // defense your action
  router.get( '/defense/:actionId/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        actionId = req.params.actionId,
        response = treatResponse( res ),
        promiseAction = actionDao.findActionId( actionId );

    promiseAction
      .then( function( action ) {

        if( action ) {

          var promiseUser = userDao.findNick( action.target.nick );

          promiseUser
            .then( function( user ) {

              if( user ) {

                var promiseParty = partyDao.findTargetInParty( nick, action.target.nick );

                promiseParty.then( function( party ) {

                  if( party.length > 0 ) {

                    // Handle Data
                    response.success( { 'target': user, 'action': action } );

                  } else {

                    response.fail( 'not-partners' );

                  }

                } );

              } else {

                response.fail( 'empty-user' );

              }

            } );

        } else {

          response.fail( 'empty-action' );

        }

      } );

  } );

  // get your line
  router.get( '/action/line/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        promiseAction = actionDao.findActionsUser( nick );

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

  // get line partner
  router.get( '/action/line/partner/:id/:token', interceptAccess.checkConnected, function( req, res, next ) {

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

                      if( party.length > 0 ) {

                        var line = sliceActions( target.nick, actions );

                        response.success( { 'line': line } );

                      } else if( party.length <= 0 ) {

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

  // get line enemy
  router.get( '/action/line/enemy/:id/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        id = req.params.id,
        response = treatResponse( res ),
        promiseUser = userDao.findNick( nick );

        promiseUser
          .then( function( user ) {

            if( user ) {

              var promiseTarget = userDao.findEnemyIdNearbyLimit( id, user.position, user.job.sight );

              promiseTarget
                .then( function( target ) {

                  if( target.length === 1 ) {

                    target = target[ 0 ];

                    var promiseActionTarget = actionDao.findActionsUser( target.nick );

                    promiseActionTarget
                      .then( function( actionsTarget ) {

                        if( actionsTarget ) {

                          var promiseParty = partyDao.findTargetInParty( nick, target.nick );

                          promiseParty.then( function( party ) {

                            if( party.length <= 0 ) {

                              var promiseActionUser = actionDao.findActionsUser( nick );

                              promiseActionUser
                                .then( function( actionsUser ) {

                                  if( actionsUser ) {

                                    var lineUser = sliceActions( nick, actionsUser ),
                                        line = sliceActions( target.nick, actionsTarget, 'enemy', lineUser );

                                    response.success( { 'line': line } );

                                  } else {

                                    response.fail( 'empty-my-actions' );

                                  }

                                } );

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
