module.exports = ( function() {

  var listUsers = function( users ) {

    var id = 0,
        list = {},
        usersLength = users.length;
    for( ; id < usersLength ; id = id + 1 ) {

      list[ users[ id ].nick ] = users[ id ];

    }

    return list;

  }

  return listUsers;

} () );