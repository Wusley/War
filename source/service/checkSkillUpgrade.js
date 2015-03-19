module.exports = ( function() {

  var checkSkillUpgrade = function( userJob, userSkillUpgrading, userSkillUpgrades, skillName ) {

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

        console.log( userSkillUpgrades);
    var upgrade = 0,
        userSkillUpgradesLength = userSkillUpgrades.length;


    for( ; upgrade < userSkillUpgradesLength ; upgrade = upgrade + 1 ) {

      if( userSkillUpgrades[ upgrade ].skill === skillName ) {

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

    console.log( status );

    return status;

  }

  return checkSkillUpgrade;

} () );