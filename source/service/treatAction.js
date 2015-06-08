module.exports = ( function() {

  var battleCompose = require( '../facade/battleCompose' );

  var treatAction = function( action, actionDao ) {

    var modelAction = false;

    if( action ) {

      var modelAction = {
        'schedule': action.schedule,
        'callback': function() {



          // montar terceiro array

          // pega = qtidade def
          // pega = qtidade atk

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

          var promiseAction = actionDao.delete( action );

          promiseAction.then( function() {

            console.log( arguments );

          } );

        }
      };

    }

    return modelAction;

  }

  return treatAction;

} () );