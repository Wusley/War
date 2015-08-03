module.exports = ( function() {

  var Action = require( '../battle/Action' ),
      skills = require( '../battle/Skills' ),
      treatSkillsArea = require( '../battle/treatSkills' ),
      _ = require( 'underscore' );

  var QueueBattle = function( users, atks, defs ) {

    // console.log( atks );

    var listBattle = [],
        defsLength = defs.length,
        atksLength = atks.length,
        bigger,
        lesser,
        status;

    // aplica o compartilhamento de skills em area para
    // os grupos da action através de um objeto herdado
    atks = treatSkillsArea( users, atks, skills.groupA );
    defs = treatSkillsArea( users, defs, skills.groupB );

    // console.log( '-=-=-=-=-=-=-atk-=-=-=-=-=-=-' );
    // for (var i = atks.length - 1; i >= 0; i--) {
    //   console.log( atks[i] );
    // };

    // console.log( '-=-=-=-=-=-=-def-=-=-=-=-=-=-' );
    // for (var i = defs.length - 1; i >= 0; i--) {
    //   console.log( defs[i] );
    // };
    // console.log( defs );
    // console.log( '-=-=-=-' );

    if( defsLength > atksLength ) {

      status = 'def';

      bigger = atks;
      bigger = defs;

    } else if( atksLength >= defsLength && defsLength > 0 ) {

      status = 'atk';

      bigger = atks;
      lesser = defs;

    } else if( defsLength <= 0 ) {

      _.reduce( atks, function( memo, num, id ) {

        listBattle.push( {
          'atk': new Action( atks[ id ], users ),
          'def': false
        } );

      }, 0 );

      return listBattle;

    }

    var biggerLength = bigger.length,
        lesserLength = lesser.length;

    var gap = Math.floor( biggerLength / lesserLength ),
        rest = ( biggerLength % lesserLength );

        // preciso contornar o problema do infinity, tanto para atacantes como para defensores
        // situacoes
        // sem defesa
        // sem ataque
        // sem defesa e sem ataque
        // analisar cada situacao e decidir se cancela a action ou nao

        // console.log( gap );
        // console.log( rest );

        // console.log( biggerLength + ' - ' + lesserLength );

    var index = 0,
        auxGap = gap + 1,
        auxRest = rest - 1;

    var gapSouls = 0,
        restSouls = 0;

    _.reduce( bigger, function( memo, num, id ) {

      if( index === auxGap ) {

        if( auxRest === memo ) {

          auxGap = auxGap - 1;

        }

        memo = memo + 1;

        index = 0;

      }

      index = index + 1;

      var auxLesser = lesser[ memo ];

      if( index === 1 ) {

        // console.log( auxGap );

        gapSouls = Math.floor( lesser[ memo ].souls / auxGap );
        restSouls = ( lesser[ memo ].souls % auxGap );

      }

      lesser[ memo ].souls = gapSouls;

      if( restSouls > 0 ) {

        lesser[ memo ].souls =  lesser[ memo ].souls + 1;

        restSouls = restSouls - 1;

      }

      bigger[ id ].skillsSolo.passive.soloTurnIn.share = lesser[ memo ].skillsSolo.passive.soloTurnOut.share;
      lesser[ memo ].skillsSolo.passive.soloTurnIn.share = bigger[ id ].skillsSolo.passive.soloTurnOut.share;

      if( status === 'atk' ) {

        listBattle.push( {
          'atk': new Action( bigger[ id ], users ),
          'def': new Action( lesser[ memo ], users )
        } );

      } else {

        listBattle.push( {
          'def': new Action( bigger[ id ], users ),
          'atk': new Action( lesser[ memo ], users )
        } );

      }

      return memo;

    }, 0 );

    return listBattle;

  }

  return QueueBattle;

} () );