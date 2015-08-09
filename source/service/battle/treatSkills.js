module.exports = ( function() {

  var treatSkills = function( users, group, templateSkills ) {

    var id = 0,
        groupLength = group.length;
    for( ; id < groupLength ; id = id + 1 ) {

      // distribui e organiza as skills
      var skills = injectSkillPassiveInFight( users[ group[ id ].nick ], templateSkills );

      group[ id ].skillsArea = skills.area; // inclementa skills em area
      group[ id ].skillsSolo = skills.solo; // inclementa skills solo

      // tratamento de skills, alterando apenas nome/lv da skill por formato completo
      group[ id ].skills = injectSkillTurns( users[ group[ id ].nick ], group[ id ].skills );

    }

    return group;

  }

  function injectSkillPassiveInFight( user, templateSkills ) {

    var jobSkills = user.job.skills,
        skillUpgrades = user.skillUpgrades,
        templateSolo = {
          passive: {
            solo: [],
            soloTurnIn: { share: [] },
            soloTurnOut: { share: [] }
          }
        };

    var skillUpgradesId = 0,
        skillUpgradesLength = skillUpgrades.length;
    for( ; skillUpgradesId < skillUpgradesLength ; skillUpgradesId = skillUpgradesId + 1 ) {

      var skill = jobSkills[ skillUpgrades[ skillUpgradesId ].skill ];

      var skillId = 0,
          skillLength = skill.length;
      for( ; skillId < skillLength ; skillId = skillId + 1 ) {

        if( skill[ skillId ].lv === skillUpgrades[ skillUpgradesId ].lv && skill[ skillId ].type === 'Passive-in-fight' ) {

          if( skill[ skillId ].effective ) {

            // Skill All Allies
            if( skill[ skillId ].effective === 'Area' ) {

              templateSkills.passive.area.push( skill[ skillId ] );

            // Skill All Enemies
            } else if( skill[ skillId ].effective === 'Area-enemy' ) {

              templateSkills.passive.areaTurnOut.share.push( skill[ skillId ] );

            // Skill Solo
            } else if( skill[ skillId ].effective === 'Solo' ) {

              templateSolo.passive.solo.push( skill[ skillId ] );

            // Skill Enemy
            } else if( skill[ skillId ].effective === 'Solo-enemy' ) {

              templateSolo.passive.soloTurnOut.share.push( skill[ skillId ] );

            }

          }

        }

      }

    }

    return {
      area: templateSkills,
      solo: templateSolo
    }

  }

  function injectSkillTurns( user, skills ) {

    var jobSkills = user.job.skills,
        skillUpgrades = user.skillUpgrades,
        list = [];

    var skillsId = 0,
        skillsLength = skills.length;
    for( ; skillsId < skillsLength ; skillsId = skillsId + 1 ) {

      var skillUpgradesId = 0,
          skillUpgradesLength = skillUpgrades.length;
      for( ; skillUpgradesId < skillUpgradesLength ; skillUpgradesId = skillUpgradesId + 1 ) {

        if( skills[ skillsId ] === skillUpgrades[ skillUpgradesId ].skill ) {

          var jobSkill = jobSkills[ skillUpgrades[ skillUpgradesId ].skill ];

          var jobSkillId = 0,
              jobSkillLength = jobSkill.length;
          for( ; jobSkillId < jobSkillLength ; jobSkillId = jobSkillId + 1 ) {

            if( jobSkill[ jobSkillId ].lv === skillUpgrades[ skillUpgradesId ].lv && jobSkill[ jobSkillId ].type === 'Active-in-fight' ) {

              list.push( jobSkill[ jobSkillId ] );

            }

          }

          continue;

        }

      }

    }

    return list;

  }

  return treatSkills;

} () );
