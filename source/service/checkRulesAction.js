
module.exports = ( function() {

  var treatSkills = require( '../service/treatSkills' );

  var checkRulesAction = function( user, data ) {

    var action = {};

    action.errors = {};

    // CHECK PARAMS
    if( user && data ) {

      var skills = treatSkills( data.skills ),
          souls = parseInt( data.souls ),
          turns = 0;

      if( skills ) {

        action.skills = skills;

        var skillsLength = action.skills.length,
            skillsId = skillsLength;
        for( ; skillsId >= 0 ; skillsId = skillsId - 1 ) {

          if( user.job.skills[ skills[ skillsId ] ] ) {

            var skillUpgradesId = 0,
                skillUpgrades = user.skillUpgrades,
                skillUpgradesLength = skillUpgrades.length;
            for( ; skillUpgradesId < skillUpgradesLength; skillUpgradesId = skillUpgradesId + 1 ) {

              if( skillUpgrades[ skillUpgradesId ].skill === action.skills[ skillsId ] ) {

                var lv = skillUpgrades[ skillUpgradesId ].lv,
                    skill = user.job.skills[ action.skills[ skillsId ] ];

                // get lv upgrades
                var skillUpgradesId = 0,
                    skillUpgrades = user.skillUpgrades,
                    skillUpgradesLength = skillUpgrades.length;
                for( ; skillUpgradesId < skillUpgradesLength; skillUpgradesId = skillUpgradesId + 1 ) {

                  if( skillUpgrades[ skillUpgradesId ].skill === action.skills[ skillsId ] ) {

                    var lv = skillUpgrades[ skillUpgradesId ].lv;

                    var skill = user.job.skills[ action.skills[ skillsId ] ];

                    // get skill lv to job
                    var skillId = 0,
                        skillLength = skill.length;
                    for( ; skillId < skillLength; skillId = skillId + 1 ) {

                      if( skill[ skillId ].lv === lv ) {

                        if( skill[ skillId ].type === 'Passive-in-fight' || skill[ skillId ].type === 'Passive' || skill[ skillId ].type === 'Active' ) {

                          action.skills.splice( skillsId, 1 );

                          action.errors.skillValid = false;

                        } else {

                          turns = turns + 1;

                          souls = souls + skill[ skillId ].souls;

                        }

                      }

                    };

                  }

                };

              }

            };

          }

        }

        // CHECK USER SOULS
        if( user.souls >= souls ) {

          action.souls = souls;

        } else {

          action.error = true;
          action.errors.souls = false;

        }

        // CHECK USER TURNS
        if( user.job.turns >= turns ) {

          action.turns = turns;

        } else {

          action.error = true;
          action.errors.turns = false;

        }

        // CHECK USER SKILLS
        if( action.skills.length <= 0 && !action.errors.skillValid ) {

          action.error = true;

        }

      } else {

        action.error = true;
        action.errors.skills = false;

      }

    } else {

      action.error = true;
      action.errors.data = false;

    }

    // RETURN RESULT
    return action;

  }

  return checkRulesAction;

} () );