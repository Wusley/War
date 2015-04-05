
module.exports = ( function() {

  var checkUserSouls = function( userSouls, upgradeSouls ) {

    var souls = parseInt( userSouls ) - parseInt( upgradeSouls );

    return souls;

  }

  return checkUserSouls;

} () );