module.exports = ( function() {

  var BattleCompose = require( '../facade/battleCompose' );

  var clone = require( 'clone' ),
      _ = require( 'underscore' );

  var treatAction = function( action, actionDao, userDao ) {

    var modelAction = false;

    if( action ) {

      var modelAction = {
        'schedule': action.schedule,
        'callback': function() {

          var battleCompose = new BattleCompose();

          var nicks = battleCompose.getNicks( action.atks, [ action.target ], action.defs );

          var promiseUser = userDao.findList( nicks );

          promiseUser
            .then( function( users ) {

              if( users ) {

                var result = battleCompose.fight( users, action );

              } else {



              }

            } );

        }
      };

    }

    modelAction.callback();

  }

  return treatAction;

} () );