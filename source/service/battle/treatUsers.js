module.exports = ( function() {

  var treatUsers = function( users ) {

    var list = {};

    var id = 0,
        usersLength = users.length;
    for( ; id < usersLength ; id = id + 1 ) {

      list[ users[ id ].nick ] = users[ id ];

    }

    return list;

  }

  return treatUsers;

} () );