module.exports = function( jobs ) {

  var treatUser = function( err, users ) {

    var type = users.constructor.name,
        handleAction = require( '../service/handleAction' );


    if( !err && type === 'Array' && users && users.length > 0 ) {

      var id = 0,
          usersLength = users.length;
      for( ; id < usersLength; id = id + 1 ) {

        users[ id ].job = jobs[ users[ id ].job ];
        users[ id ] = handleAction.passiveSkills( users[ id ] );

      }

    } else if( !err && type === 'Object' && users  ) {

      users.job = jobs[ users.job ];
      users = handleAction.passiveSkills( users );

    }

  }

  return treatUser;

};