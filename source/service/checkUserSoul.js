
module.exports = ( function() {

  var checkUserSoul = function( userSoul, upgradeSoul ) {

    var soul = parseInt( userSoul ) - parseInt( upgradeSoul );

    return soul;

  }

  return checkUserSoul;

} () );