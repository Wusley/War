module.exports = ( function() {

  var treatAction = function( action, actionDao ) {

    var modelAction = false;

    if( action ) {

      var modelAction = {
        'schedule': action.schedule,
        'callback': function() {

          // realizar calculos de batalha.
          // desativar action
          // atualizar os envolvidos

          // console.log( 'BOOOOOOOM' );

          // var promiseUserUpgrade = userDao.updateSkillUpgrade( nick, upgrading );

          // promiseUserUpgrade
          //   .then( function( user ) {

          //     if( user ) {

          //       console.log( user );

          //     }

          //   } );

        }
      };

    }

    return modelAction;

  }

  return treatAction;

} () );