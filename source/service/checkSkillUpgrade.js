module.exports = ( function() {

  var checkSkillUpgrade = function( userJob, userSkillUpgrading, userSkillUpgrades, skillName ) {

    var status = {};

    status.job = false;
    status.upgrading = false;
    status.upgrade = false;

    // for in ca sa porra
    var skill = 0,
        skills = userJob.skills,
        skillsLength = userJob.skills.length;
    for( skill in skills ) {

      console.log(skills[ skill ].name);

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

    return status;

  }

  return checkSkillUpgrade;

} () );