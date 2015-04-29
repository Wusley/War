module.exports = function( userDao, actionDao ) {

  var _ = require( 'underscore' );

  var promiseAction = actionDao.findActionId( '553c7de40ad193c2ed944d53' );

        // montar terceiro array

          // verifica qm é maior
          // maior / menor

          // 1579
          // 386
          // floor 4 ( slice )
          // % 35

          // os 35 primeiros ( slice + 1 )
          // os demais ( slice )
          // em order do maior

          // count maior
          // % primeiros
          // { maior, menor / ( slice + 1 ) }
          // { maior, menor / ( slice ) }

          // calcular batalha seguindo for do maior
          // users atks x users defs

          // armazenar no doc as batalhas
          // loop nas batalhas pra somar cada resultado
          // maior pontuacao de def ou atk ganha mais X pontos

          // subrai os pontos perdidos e adiciona pontos ganhos por participacao
          // soma pontos para a equipe vencedora

          // atualizar users

          // armazena resultado e desativa action











  function battle( action ) {

    var defsLength = action.defs.length,
        atksLength = action.atks.length;

    if( defsLength > atksLength ) {

      mountArr( action.defs, action.atks );

      console.log( 'def maior' );

    } else if( defsLength < atksLength ) {

      mountArr( action.atks, action.defs );

      console.log( 'atk maior' );

    } else {

      console.log( 'iguais' );

    }

  }

  function mountArr( bigger, lesser ) {

    var biggerLength = bigger.length,
        lesserLength = lesser.length;

    var floor = 0,
        rest = 0;

    floor = Math.floor( biggerLength / lesserLength );

    rest = ( biggerLength % lesserLength );

    var first = _.first( lesser, ( biggerLength % lesserLength ) );

    console.log( first );

    var last = _.last( lesser, ( lesserLength - rest ) );

    console.log( last );


    // aplicar o mesmo conceito nas souls do ataque ;)

  }

  promiseAction
    .then( function( action ) {

      if( action ) {

        battle( action );

      } else {

        console.log( 'bleeeh' );

      }

    } );

};