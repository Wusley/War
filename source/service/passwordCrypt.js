module.exports = ( function() {

  var passwordCrypt = function() {

    var bcrypt = require( 'bcrypt' ),
        userConfig = require( '../config/user' );

    return {
      insurance: function( password ) {

        var composedPassword = userConfig.tokenAccess + password,
            salt = bcrypt.genSaltSync( 3 );

        var hash = bcrypt.hashSync( composedPassword, salt );

        return hash;

      },
      compare: function( hash, password ) {

        var composedPassword = userConfig.tokenAccess + password,
            status = bcrypt.compareSync( composedPassword, hash );

        return status;

      }
    };

  };

  return passwordCrypt;

} () );