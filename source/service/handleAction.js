module.exports = {
  passiveSkills: function( user ) {

    if( user && user.skillUpgrades ) {

      var id = 0,
          skillsLength = user.skillUpgrades.length;
      for( ; id < skillsLength; id = id + 1 ) {

        if( user.job.skills[ user.skillUpgrades[ id ].skill ] ) {

          if( user.job.skills[ user.skillUpgrades[ id ].skill ].type === 'Passive' ) {

            user.job = user.job.skills[ user.skillUpgrades[ id ].skill ].recipe( user.job );

          }

        }

      }

      return user;

    }

  },
  actveSkill: function( user, target ) {

    if( user && user.skillUpgrades ) {

    }

    return user;

  },
  attackSkill: function( user ) {

    if( user && user.skillUpgrades ) {

    }

    return user;

  },
  defenseSkill: function( user ) {

    if( user && user.skillUpgrades ) {

    }

    return user;

  }
};