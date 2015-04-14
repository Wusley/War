
module.exports = ( function() {

  var treatSkills = require( '../service/treatSkills' );

  var checkRulesAction = function( user, data ) {

    // console.log( data );

    var action = {};

    action.errors = {};

    // CHECK PARAMS
    if( user && data ) {

      var skills = treatSkills( data.skills ),
          souls = parseInt( data.souls ),
          turns = 0;

      if( skills ) {

        action.skills = skills;

        var id = 0,
            skillsLength = skills.length;
        for( ; id < skillsLength ; id = id + 1 ) {

          turns = turns + 1;

          // console.log( user );

          souls = souls + user.job.skills[ skills[ id ] ].souls;

        };

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