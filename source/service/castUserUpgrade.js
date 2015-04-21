module.exports = ( function() {

  var userUpgrade = require( '../config/userUpgrade' );

  var castUserUpgrade = function( times, heroes, souls ) {

    for( ; times > 0 ; times = times - 1 ) {

      souls += Math.ceil( heroes * userUpgrade.percentSouls );
      heroes += Math.ceil( heroes * userUpgrade.percentHeroes );

    }

    return { souls: souls, heroes: heroes };

  }

  return castUserUpgrade;

} () );
