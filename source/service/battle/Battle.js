module.exports = ( function() {

  var Battle = function( listBattle ) {

    var count = 0,
        turns = 0;

    var util = require( 'util' );


    do {

      var id = 0,
          listBattleLength = listBattle.length;
      for( ; id < listBattleLength ; id = id + 1 ) {

      // defs first

      // teste de iniciativa ( random )
      // se o teste empatar faz-se um novo teste
      // ou utilizamos destreza do time

      // na separação das skills, tirar skills repetidas dos groups

        // fight passive area defense
        hitGroupSkills( listBattle[ id ].def.skillsArea.passive.area );

        // fight passive area attack
        hitGroupSkills( listBattle[ id ].atk.skillsArea.passive.area );

        // fight passive area out defense
        hitGroupSkills( listBattle[ id ].atk.skillsArea.passive.areaTurnIn.share );

        // fight passive area out attack
        hitGroupSkills( listBattle[ id ].def.skillsArea.passive.areaTurnIn.share );

        // fight passive solo defense
        hitGroupSkills( listBattle[ id ].def.skillsSolo.passive.solo );

        // fight passive solo defense
        hitGroupSkills( listBattle[ id ].def.skillsSolo.passive.solo );

        // fight passive solo in attack
        hitGroupSkills( listBattle[ id ].atk.skillsSolo.passive.soloTurnIn.share );

        // fight passive solo in defense
        hitGroupSkills( listBattle[ id ].def.skillsSolo.passive.soloTurnIn.share );

    // atks first

        // fight active area attack

        // fight active solo attack

        // fight active area attack

        // fight active solo attack

        console.log( '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n' );
        console.log( '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n' );
        console.log( '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n' );
        console.log( '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-' );

        // console.log( listBattle[ id ].atk.nick );
        // console.log( util.inspect( listBattle[ id ].atk.skillsArea.passive, { showHidden: false, depth: null } ) );

        // console.log( listBattle[ id ].def.nick );
        // console.log( util.inspect( listBattle[ id ].def.skillsArea.passive, { showHidden: false, depth: null } ) );

        // console.log( count );

        turns = updateTurns( turns, listBattle[ id ].atk, listBattle[ id ].def );

      }

      count = count + 1;

    } while( count < turns );

    function updateTurns( turns, atk, def ) {

      if( turns < atk.turns ) {

        turns = atk.turns;

      }

      if( turns < def.turns ) {

        turns = def.turns;

      }

      return turns;

    }

    function hitGroupSkills( group ) {

      var id = 0,
          groupLength = group.length;
      for( ; id < groupLength ; id = id + 1 ) {

        console.log( group[ id ].name );

      }

    }

  }

  return Battle;

} () );