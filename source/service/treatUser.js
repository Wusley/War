module.exports = function( jobs ) {

  var treatUser = function( err, users ) {

    var type = users.constructor.name;

    if( !err && type === 'Array' && users && users.length > 0 ) {

      var id = 0,
          usersLength = users.length;
      for( ; id < usersLength; id = id + 1 ) {

        users[ id ].job = jobs[ users[ id ].job ];

      }

    } else if( !err && type === 'Object' && users  ) {

      users.job = jobs[ users.job ];

    }

  }

  return treatUser;

};