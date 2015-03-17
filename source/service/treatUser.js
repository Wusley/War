module.exports = ( function() {

  var treatUser = function( users, jobs ) {

    if( users.length === 1 ) {

      users.job = jobs[ users.job ];

    } else if( users.length > 1 ) {

      var id = 0,
          usersLength = users.length;
      for( ; id < usersLength; id = id + 1 ) {

        users[ id ].job = jobs[ users[ id ].job ];

      }

    }

  }

  return treatUser;

} () );