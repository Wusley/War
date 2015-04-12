module.exports = ( function() {

  var checkRulesAction = require( '../service/checkRulesAction' );

  var handleNewAttack = function( nick, action, userDao, partyDao, response ) {

    var promiseUser = userDao.findUser( nick ),
        promiseParty = partyDao.findTargetInParty( nick, action.target );

    promiseUser.then( function( user ) {

      if( user ) {

        userDao.findUserTargetAndDistance( user, action.target, { 'success': function( user, target ) {

          var data = checkRulesAction( user, action );

          if( !data.error ) {

            promiseParty.then( function( party ) {

              if( party.length === 2 ) {

                response.success( {
                  'user': user,
                  'target': target,
                  'title': action.title,
                  'souls': data.souls,
                  'skills': data.skills
                } );

              } else {

                response.fail( 'party' );

              }

            } );

          } else {

            response.fail( { 'errors': action.errors } );

          }

        }, 'fail': response.fail } );

      } else {

        response.fail( 'empty-user' )

      }

    } );

  }

  return handleNewAttack;

} () );