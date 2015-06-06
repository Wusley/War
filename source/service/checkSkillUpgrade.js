module.exports = ( function() {

  var checkSkillUpgrade = function( skills, userSkillUpgrading, userSkillUpgrades, skillId ) {

    var status = {};

    status.job = false;
    status.upgrading = false;
    status.upgrade = false;
    status.overTraining = false;
    status.underTraining = false;

    var skillLv = 1,
        skillName = '';

    var colId = 0;
    for( colId in skills ) {

      var id = 0,
          skillsLength = skills[ colId ].length;
      for( ; id < skillsLength ; id = id + 1 ) {

        if( skills[ colId ][ id ] && String( skills[ colId ][ id ]._id ) === String( skillId ) ) {

          skillLv = parseInt( skills[ colId ][ id ].lv );
          skillName = String( skills[ colId ][ id ].name );

          status.job = true;

          break;

        }

      }

    }

    var upgrading = 0,
        userSkillUpgradingLength = userSkillUpgrading.length;
    for( ; upgrading < userSkillUpgradingLength ; upgrading = upgrading + 1 ) {

      if( userSkillUpgrading[ upgrading ] && String( userSkillUpgrading[ upgrading ].id ) === String( skillId ) ) {

        status.upgrading = true;

      }

    }

    var upgrade = 0,
        userSkillUpgradesLength = userSkillUpgrades.length,
        exists = false;
    for( ; upgrade < userSkillUpgradesLength ; upgrade = upgrade + 1 ) {

      if( String( userSkillUpgrades[ upgrade ].skill ) === skillName ) {

        exists = true;

        if( userSkillUpgrades[ upgrade ] && String( userSkillUpgrades[ upgrade ].id ) === String( skillId ) ) {

          status.upgrade = true;

        } else {

          if( parseInt( userSkillUpgrades[ upgrade ].lv + 1 ) < skillLv ) {

            status.overTraining = true;

          } else if( skillLv <= parseInt( userSkillUpgrades[ upgrade ].lv ) ) {

            status.underTraining = true;

          }

        }

        break;

      }

    }

    if( !status.job ) {

      status = 'job';

    } else if( status.upgrade && status.upgrading ) {

      status = 'upgrade upgrading';

    } else if( status.upgrading ) {

      status = 'upgrading';

    } else if( status.upgrade ) {

      status = 'upgrade';

    } else if( status.overTraining || ( !exists && skillLv > 1 ) ) {

      status = 'overTraining';

    } else if( status.underTraining ) {

      status = 'underTraining';

    } else {

      status = '';

    }

    return status;

  }

  return checkSkillUpgrade;

} () );