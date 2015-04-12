module.exports = ( function() {

  var treatSkillUpgrading = function( nick, skillUpgrading, userDao ) {

    var modelSkillUpgrading = false;

    if( skillUpgrading ) {

      var modelSkillUpgrading = {
        'schedule': skillUpgrading.schedule,
        'callback': function() {

          var promiseUserSkillUserUpgrade = userDao.updateSkillUpgrade( nick, skillUpgrading );

          promiseUserSkillUserUpgrade
            .then( function( user ) {

              if( user ) {

                console.log( user );

              }

            } );

        }
      }

    }

    return modelSkillUpgrading;

  }

  return treatSkillUpgrading;

} () );