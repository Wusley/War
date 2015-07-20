module.exports = function( User, jobs ) {

  var clone= require( 'clone' ),
      treatSouls = require( '../service/treatSouls' )( User );

  var treatUser = function( err, users ) {

    if( !err ) {

      if( users ) {

        treatSouls( users, { 'success': function( data ) {

          var users = data.users;

          var type = users.constructor.name,
              handleAction = require( '../service/handleAction' );

          if( type === 'Array' && users.length > 0 ) {

            var id = 0,
                usersLength = users.length;
            for( ; id < usersLength; id = id + 1 ) {

              users[ id ].job = clone( jobs[ users[ id ].job ] );

              users[ id ] = handleAction.passiveSkills( users[ id ] );

            }

          } else if( type === 'Object' ) {

            users.job = clone( jobs[ users.job ] );

            users = handleAction.passiveSkills( users );

          }

        },
        'fail': function() {

          console.log( 'error' );

        } } );

      }

    }

  }

  return treatUser;

};