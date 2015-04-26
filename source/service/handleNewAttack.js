module.exports = ( function() {

  var checkRulesAction = require( '../service/checkRulesAction' );

  var handleNewAttack = function( nick, action, userDao, partyDao, response ) {

    var promiseUser = userDao.findNick( nick ),
        promiseParty = partyDao.findTargetInParty( nick, action.target );

    promiseUser.then( function( user ) {

      if( user ) {

        userDao.findUserTargetAndDistance( user, action.target, { 'success': function( data ) {

          var user = data.user;
              target = data.target;

          var data = checkRulesAction( user, action );

          if( !data.error ) {

            promiseParty.then( function( party ) {

              if( party.length <= 0 ) {

                response.success( {
                  'user': user,
                  'target': target,
                  'title': action.title,
                  'actSouls': action.souls,
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