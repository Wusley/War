module.exports = ( function() {

  var clone = require( 'clone' ),
      _ = require( 'underscore' ),

      // distribui a lista de atk, def proporcionalmente
      listUsers = require( '../service/listUsers' ),
      queueBattle = require( '../service/battle/queueBattle' ),
      battle = require( '../service/battle/Battle' );

  var battleCompose = function() {

    return {
      fight: function( users, action ) {

        // console.log( users );
        // console.log( action );

        var users = listUsers( users );

        var listBattle = queueBattle( users, action.atks, action.defs );

        var util = require( 'util' );

        // console.log( util.inspect( listBattle, { showHidden: false, depth: null } ) );

        // console.log( listBattle );

        battle( listBattle );

        return {};

      }
    };

  };

  return battleCompose;

} () );