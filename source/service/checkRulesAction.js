
module.exports = ( function() {

  var treatSkills = require( '../service/treatSkills' );

  var checkRulesAction = function( user, data ) {

    var action = {};

    // CHECK PARAMS
    if( user && data ) {

      var skills = treatSkills( data.skills ),
          souls = parseInt( data.soul ),
          turns = 0;

      if( skills ) {

        action.skills = skills;

        var id = 0,
            skillsLength = skills.length;
        for( ; id < skillsLength ; id = id + 1 ) {

          turns = turns + 1;

          souls = souls + user.job.skills[ skills[ id ] ].soul;

        };

        // CHECK USER SOUL
        if( user.soul >= souls ) {

          action.souls = souls;

        } else {

          action.error = true;

        }

        // CHECK USER TURNS
        if( user.job.turns >= turns ) {

          action.turns = turns;

        } else {

          action.error = true;

        }

      } else {

        action.error = true;

      }

    } else {

      action.error = true;

    }

    // RETURN RESULT
    return action;

  }

  return checkRulesAction;

} () );