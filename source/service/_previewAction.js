module.exports = function( userDao, actionDao, cache ) {

  var _ = require( 'underscore' );

  var promiseAction = actionDao.findActionId( '553c7de40ad193c2ed944d53' );

  // armazenar no doc as batalhas
  // loop nas batalhas pra somar cada resultado
  // maior pontuacao de def ou atk ganha mais X pontos

  // subrai os pontos perdidos e adiciona pontos ganhos por participacao
  // soma pontos para a equipe vencedora

  // atualizar users

  // armazena resultado e desativa action

  function treatBattle( action ) {

    var listBattle = mountBattle( action.atks, action.defs );

    battle( listBattle );

  }

  function battle( listBattle ) {

    var resultList = [];


    // users atks x users defs
    var id = 0,
        listBattleLength = listBattle.length;
    for( ; id < listBattleLength ; id = id + 1 ) {

      resultList.push( {
        'atk': listBattle[ id ].atk,
        'def': listBattle[ id ].def,
        'result': recipe( listBattle[ id ].atk, listBattle[ id ].def )
      } );

    }

    console.log( resultList );

    // function ( job ) {

    //   job.sight = job.sight * 1.2;

    //   return job;

    // }

  }

  function recipe( atk, def ) {

    var result = [];

    // calcular batalha

    // atk
    // aplica skill

    // def
    // aplica skill

    // battle
    // aplica formula

    return result;

  }

  function mountBattle( atks, defs ) {

    var listBattle = [],
        defsLength = defs.length,
        atksLength = atks.length,
        bigger,
        lesser,
        status;

    if( defsLength > atksLength ) {

      status = 'def';

      bigger = defs;
      lesser = atks;

    } else if( defsLength < atksLength ) {

      status = 'atk';

      bigger = atks;
      lesser = defs;

    }

    var biggerLength = bigger.length,
        lesserLength = lesser.length;

    var gap = Math.floor( biggerLength / lesserLength ),
        rest = ( biggerLength % lesserLength );

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

        gapSouls = Math.floor( lesser[ memo ].souls / auxGap );
        restSouls = ( lesser[ memo ].souls % auxGap );

      }

      lesser[ memo ].souls = gapSouls;

      if( restSouls > 0 ) {

        lesser[ memo ].souls =  lesser[ memo ].souls + 1;

        restSouls = restSouls - 1;

      }

      if( status === 'atk' ) {

        listBattle.push( {
          'atk': {
            job: cache.jobs[ bigger[ id ].job ],
            nick: bigger[ id ].nick,
            souls: bigger[ id ].souls,
            skills: bigger[ id ].skills
          },
          'def': {
            job: cache.jobs[ lesser[ memo ].job ],
            nick: lesser[ memo ].nick,
            souls: lesser[ memo ].souls,
            skills: lesser[ memo ].skills
          }
        } );

      } else {

        listBattle.push( {
          'def': {
            job: cache.jobs[ bigger[ id ].job ],
            nick: bigger[ id ].nick,
            souls: bigger[ id ].souls,
            skills: bigger[ id ].skills
          },
          'atk': {
            job: cache.jobs[ lesser[ memo ].job ],
            nick: lesser[ memo ].nick,
            souls: lesser[ memo ].souls,
            skills: lesser[ memo ].skills
          }
        } );
      }

      return memo;

    }, 0 );

    return listBattle;

  }

  promiseAction
    .then( function( action ) {

      if( action ) {

        treatBattle( action );

      } else {

        console.log( 'bleeeh' );

      }

    } );

};