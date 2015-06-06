module.exports = ( function() {

  var treatSkillUpgrading = function( nick, skillUpgrading, userDao ) {

    var modelSkillUpgrading = false;

    if( skillUpgrading ) {

      var modelSkillUpgrading = {
        'schedule': skillUpgrading.schedule,
        'callback': function() {

          userDao.updateSkillUpgrade( nick, skillUpgrading, function( user ) {

            console.log( user );

          } );

        }
      }

    }

    return modelSkillUpgrading;

  }

  return treatSkillUpgrading;

} () );