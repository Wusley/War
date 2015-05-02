module.exports = ( function() {

  var sliceActions = function( nick, actions, type, refer ) {

    var line = {};
        line.attack = [];
        line.outAttack = [];
        line.overAttack = [];
        line.outDefense = [];
        line.overDefense = [];

    // Ajuda a manter algumas lines de terceiros
    var keeps = {};

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

          // verifica se estou defendendo
          var defId = 0,
              defsLength = actions[ id ].defs.length;
          for( ; defId < defsLength ; defId = defId + 1 ) {

            if( actions[ id ].defs[ defId ].nick === nick ) {

              line.outDefense.push( actions[ id ] );

              break;

            }

          }

        }

      }

    }

    if( type === 'enemy' ) {

      var attack = line.attack;
      line.attack = [];

      var outAttack = line.outAttack;
      line.outAttack = [];

      var referId = 0,
          atkId = 0,
          outId = 0,
          referLength = refer.overAttack.length;
      for( ; referId < referLength ; referId = referId + 1 ) {

        var atkLength = attack.length;
        for( ; atkId < atkLength ; atkId = atkId + 1 ) {

          if( refer.overAttack[ referId ].target.nick === attack[ atkId ].target.nick ) {

            line.attack.push( attack[ atkId ] );

            continue;

          }

        }

        var outLength = outAttack.length;
        for( ; outId < outLength ; outId = outId + 1 ) {

          if( refer.overAttack[ referId ].target.nick === outAttack[ outId ].target.nick ) {

            line.outAttack.push( outAttack[ outId ] );

            continue;

          }

        }

      }

      if( line.attack.length <= 0 ) {
        delete line.attack;
      }

      if( line.outAttack.length <= 0 ) {
        delete line.outAttack;
      }

      delete line.outDefense;
      delete line.overDefense;
    }

    return line;

  }

  return sliceActions;

} () );