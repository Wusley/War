module.exports = ( function() {

  var clone = require( 'clone' ),
      _ = require( 'underscore' ),

      // distribui a lista de atk, def proporcionalmente
      treatUsers = require( '../service/battle/treatUsers' ),
      queueBattle = require( '../service/battle/queueBattle' );

  var battleCompose = function() {

    this.users = {};

    function battle( listBattle ) {

      var count = 0,
          turns = 0;

      do {

        var id = 0,
            listBattleLength = listBattle.length;
        for( ; id < listBattleLength ; id = id + 1 ) {

          // do fight ;)
          // console.log( count );

          turns = updateTurns( turns, listBattle[ id ].atk, listBattle[ id ].def );

        }

        count = count + 1;

      } while( count < turns );

    }

    function updateTurns( turns, atk, def ) {

      if( turns < atk.turns ) {

        turns = atk.turns;

      }

      if( turns < def.turns ) {

        turns = def.turns;

      }

      return turns;

    }

    return {
      getNicks: function( atks, defs ) {

        var users =_.union( atks, defs );

        return _.pluck( users, 'nick' );

      },
      fight: function( users, action ) {

        this.users = treatUsers( users );

        var listBattle = queueBattle( this.users, action.atks, action.defs );

        battle( listBattle );

        return {};

      }
    };

  };

  return battleCompose;

} () );