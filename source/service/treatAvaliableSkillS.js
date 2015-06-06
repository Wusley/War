module.exports = ( function() {

  var _ = require( 'underscore' );

  var treatAvaliableSkillS = function( skills, skillUpgrades, skillUpgrading ) {

    // verify upgrades
    if( skillUpgrades ) {

      var skillUpgradesId = 0,
          skillUpgradesLength = skillUpgrades.length;
      for( ; skillUpgradesId < skillUpgradesLength ; skillUpgradesId = skillUpgradesId + 1 ) {

        var name = skillUpgrades[ skillUpgradesId ].skill,
            id = skillUpgrades[ skillUpgradesId ].id;

        if( skills[ name ] ) {

          var skillId = 0,
              skillLength = skills[ name ].length;
          for( ; skillId < skillLength ; skillId = skillId + 1 ) {

            skills[ name ][ skillId ].upgrade = true;

            if( String( skills[ name ][ skillId ]._id ) === String( id ) ) {

              if( skills[ name ][ skillId + 1 ] ) {

                skills[ name ][ skillId + 1 ].upgradeAvaliable = true;

              }

              break;

            }

          }

        }

      }

    }

    // verify upgrading
    if( skillUpgrading ) {

      var skillUpgradingId = 0,
          skillUpgradingLength = skillUpgrading.length;
      for( ; skillUpgradingId < skillUpgradingLength ; skillUpgradingId = skillUpgradingId + 1 ) {

        var name = skillUpgrading[ skillUpgradingId ].skill,
            id = skillUpgrading[ skillUpgradingId ].id;

        if( skills[ name ] ) {

          var skillId = 0,
              skillLength = skills[ name ].length;
          for( ; skillId < skillLength ; skillId = skillId + 1 ) {

            if( String( skills[ name ][ skillId ]._id ) === String( id ) ) {

              skills[ name ][ skillId ].upgrading = true;

            }

          }

        }

      }

    }

    // console.log( skills );

    return skills;

  }

  return treatAvaliableSkillS;

} () );