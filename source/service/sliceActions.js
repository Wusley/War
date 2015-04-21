module.exports = ( function() {

  var sliceActions = function( nick, actions ) {

    var line = {};
        line.attack = [];
        line.overAttack = [];
        line.outAttack = [];
        line.overDefense = [];
        line.outDefense = [];

    if( actions ) {

      var id = 0,
          actionsLength = actions.length;
      for( ; id < actionsLength ; id = id + 1 ) {

        if( actions[ id ].attack.nick === nick ) {

          // verifica se estou atacando
          var atkId = 0,
              atksLength = actions[ id ].atks.length;
          for( ; atkId < atksLength ; atkId = atkId + 1 ) {

            if( actions[ id ].atks[ atkId ].nick === nick ) {

              line.attack.push( actions[ id ] );

              break;

            }

          }

          // verifica se estou defendendo o mesmo que estou atacando
          var defId = 0,
              defsLength = actions[ id ].defs.length;
          for( ; defId < defsLength ; defId = defId + 1 ) {

            if( actions[ id ].defs[ defId ].nick === nick ) {

              line.outDefense.push( actions[ id ] );

              break;

            }

          }

        } else if( actions[ id ].target.nick === nick ) {

          // verifica se estou sendo atacado
          if( actions[ id ].atks.length ) {

            line.overAttack.push( actions[ id ] );

          }

          // verifica se estou sendo defendido
          if( actions[ id ].defs.length ) {

            line.overDefense.push( actions[ id ] );

          }

        } else {

          // verifica se estou atacando
          var atkId = 0,
              atksLength = actions[ id ].atks.length;
          for( ; atkId < atksLength ; atkId = atkId + 1 ) {

            if( actions[ id ].atks[ atkId ].nick === nick ) {

              line.outAttack.push( actions[ id ] );

              break;

            }

          }

          // verifica se estou defendendo o mesmo que estou atacando
          var defId = 0,
              defsLength = actions[ id ].defs.length;
          for( ; defId < defsLength ; defId = defId + 1 ) {

            if( actions[ id ].defs[ defId ].nick === nick ) {

              line.outDefense.push( actions[ id ] );

              break;

            }

          }

        }

      };

    }

    return line;

  }

  return sliceActions;

} () );