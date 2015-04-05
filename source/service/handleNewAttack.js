module.exports = ( function() {

  var checkRulesAction = require( '../service/checkRulesAction' );

  var handleNewAttack = function( nick, action, userDao, partyDao, success, fail ) {

    var promiseUser = userDao.findUser( nick ),
        promiseParty = partyDao.findTargetInParty( nick, action.target );

    function _success( user, target ) {

      var data = checkRulesAction( user, action );

      if( !data.error ) {

        promiseParty.then( function( party ) {

          if( party.length === 2 ) {

            success( user, target, action.title, data.souls, data.skills );

          } else {

            fail( 'party' );

          }

        } );

      } else {

        fail( 'errors', action.errors );

      }

    }

    promiseUser.then( function( user ) {

      if( user ) {

        userDao.findUserTargetAndDistance( user, action.target, _success, fail );

      } else {

        fail( 'user' )

      }

    } );

  }

  return handleNewAttack;

} () );