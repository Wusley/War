module.exports = ( function() {

  var treatAction = function( action, actionDao ) {

    var modelAction = false;

    if( action ) {

      var modelAction = {
        'schedule': action.schedule,
        'callback': function() {

          // calcular batalha
          // users atks x users defs
          // shuffle atks x defs
          // def randomiza list atk e insere na posicao do atacante
          // quando acabar a primeira lista, insere na segunda e assim por diante



          // atualizar users

          // desativar action

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