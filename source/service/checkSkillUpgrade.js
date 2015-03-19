module.exports = ( function() {

  var checkSkillUpgrade = function( userJob, userSkillUpgrading, userUpgrades, skillName ) {

    var status = {};

    status.job = false;
    status.upgrading = false;
    status.upgrade = false;

    var skill = 0,
        skills = userJob.skills,
        skillsLength = userJob.skills.length;
    for( ; skill < skillsLength ; skill = skill + 1 ) {

      if( skills[ skill ].name === skillName ) {

        status.job = true;

      }

    };

    var upgrading = 0,
        userSkillUpgradingLength = userSkillUpgrading.length;
    for( ; upgrading < userSkillUpgradingLength ; upgrading = upgrading + 1 ) {

      if( userSkillUpgrading[ upgrading ].skill === skillName ) {

        status.upgrading = true;

      }

    };

    var upgrade = 0,
        userUpgradesLength = userUpgrades.length;
    for( ; upgrade < userUpgradesLength ; upgrade = upgrade + 1 ) {

      if( userUpgrades[ upgrade ].skill === skillName ) {

        status.upgrade = true;

      }

    };

    if( !status.job ) {

      status = 'job';

    } else if( status.upgrade && status.upgrading ) {

      status = 'upgrade upgrading';

    } else if( status.upgrading ) {

      status = 'upgrading';

    } else if( status.upgrade ) {

      status = 'upgrade';

    } else {

      status = '';

    }

    return status;

  }

  return checkSkillUpgrade;

} () );