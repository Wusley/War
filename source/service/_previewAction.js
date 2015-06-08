module.exports = function( userDao, actionDao, cache ) {

  var clone = require( 'clone' ),
      _ = require( 'underscore' );

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

  function applyPassiveFightSkills( listBattle ) {

    var passive = {}

    passive.atks = {};
    passive.atks.party = [];
    passive.atks.enemy = [];
    passive.defs = {};
    passive.defs.party = [];
    passive.defs.enemy = [];

    var id = 0,
        listBattleLength = listBattle.length;
    for( ; id < listBattleLength ; id = id + 1 ) {

      // ATK
      var skillFightAtkId = 0,
          skillsFightAtk = listBattle[ id ].atk.user.job.skillsFight.passive;
      for( skillFightAtkId in skillsFightAtk ) {

        var skills = skillsFightAtk[ skillFightAtkId ];

        // armazena skill de area para party
        if( skills.effective === 'Area-party' ) {

          listBattle[ id ].atk.user.job.passiveFightSkillsStatus = true;
          passive.atks.party.push( skills );

        // armazena skill de area para enemy
        } else if( skills.effective === 'Area-enemy' ) {

          passive.atks.enemy.push( skills );

        // aplica skill no proprio usuario
        } else if( skills.effective === 'Single' ) {

          if( !listBattle[ id ].atk.user.job.passiveFightSkills ) {

            listBattle[ id ].atk.user.job.passiveFightSkills = {};

          }

          listBattle[ id ].atk.user.job.passiveFightSkillsStatus = true;
          listBattle[ id ].atk.user.job.passiveFightSkills[ skills.name ] = skills;

        // aplica skill no enemy
        } else if( skills.effective === 'Single-enemy' ) {

          if( !listBattle[ id ].def.user.job.passiveFightSkills ) {

            listBattle[ id ].def.user.job.passiveEnemyFightSkills = {};

          }

          listBattle[ id ].def.user.job.passiveEnemyFightSkills[ skills.name ] = skills;

        }

      }

      // DEF
      var skillFightDefId = 0,
          skillsFightDef = listBattle[ id ].def.user.job.skillsFight.passive;
      for( skillFightDefId in skillsFightDef ) {

        var skills = skillsFightDef[ skillFightDefId ];

        // armazena skill de area para party
        if( skills.effective === 'Area-party' ) {

          listBattle[ id ].def.user.job.passiveFightSkillsStatus = true;
          passive.defs.party.push( skills );

        // armazena skill de area para enemy
        } else if( skills.effective === 'Area-enemy' ) {

          passive.defs.enemy.push( skills );

        // aplica skill no proprio usuario
        } else if( skills.effective === 'Single' ) {

          if( !listBattle[ id ].def.user.job.passiveFightSkills ) {

            listBattle[ id ].def.user.job.passiveFightSkills = {};

          }

          listBattle[ id ].def.user.job.passiveFightSkillsStatus = true;
          listBattle[ id ].def.user.job.passiveFightSkills[ skills.name ] = skills;

        // aplica skill no enemy
        } else if( skills.effective === 'Single-enemy' ) {

          if( !listBattle[ id ].atk.user.job.passiveFightSkills ) {

            listBattle[ id ].atk.user.job.passiveEnemyFightSkills = {};

          }

          listBattle[ id ].atk.user.job.passiveEnemyFightSkills[ skills.name ] = skills;

        }

      }

    }

    var id = 0,
        listBattleLength = listBattle.length;
    for( ; id < listBattleLength ; id = id + 1 ) {

      // aplica skill passiva party do grupo de atk
      var passiveAtksPartyId = 0,
          passiveAtksPartyLength = passive.atks.party.length;
      for( ; passiveAtksPartyId < passiveAtksPartyLength ; passiveAtksPartyId = passiveAtksPartyId + 1 ) {

        if( !listBattle[ id ].atk.user.job.passiveFightSkills ) {

          listBattle[ id ].atk.user.job.passiveFightSkills = {};

        }

        if( !listBattle[ id ].atk.user.job.passiveFightSkills[ passive.atks.party[ passiveAtksPartyId ].name ] || listBattle[ id ].atk.user.job.passiveFightSkills[ passive.atks.party[ passiveAtksPartyId ].name ].lv < passive.atks.party[ passiveAtksPartyId ].lv ) {

          listBattle[ id ].atk.user.job.passiveFightSkills[ passive.atks.party[ passiveAtksPartyId ].name ] = passive.atks.party[ passiveAtksPartyId ];

        }

      }

      // aplica skill passiva enemy do grupo de atk
      var passiveAtksEnemyId = 0,
          passiveAtksEnemyLength = passive.atks.enemy.length;
      for( ; passiveAtksEnemyId < passiveAtksEnemyLength ; passiveAtksEnemyId = passiveAtksEnemyId + 1 ) {

        if( !listBattle[ id ].def.user.job.passiveFightSkills ) {

          listBattle[ id ].def.user.job.passiveEnemyFightSkills = {};

        }

        if( !listBattle[ id ].def.user.job.passiveEnemyFightSkills[ passive.atks.enemy[ passiveAtksEnemyId ].name ] || listBattle[ id ].def.user.job.passiveEnemyFightSkills[ passive.atks.enemy[ passiveAtksEnemyId ].name ].lv < passive.atks.enemy[ passiveAtksEnemyId ].lv ) {

          listBattle[ id ].def.user.job.passiveEnemyFightSkills[ passive.atks.enemy[ passiveAtksEnemyId ].name ] = passive.atks.enemy[ passiveAtksEnemyId ];

        }

      }

      // aplica skill passiva party do grupo de def
      var passiveDefsPartyId = 0,
          passiveDefsPartyLength = passive.defs.party.length;
      for( ; passiveDefsPartyId < passiveDefsPartyLength ; passiveDefsPartyId = passiveDefsPartyId + 1 ) {

        if( !listBattle[ id ].def.user.job.passiveFightSkills ) {

          listBattle[ id ].def.user.job.passiveFightSkills = {};

        }

        if( !listBattle[ id ].def.user.job.passiveFightSkills[ passive.defs.party[ passiveDefsPartyId ].name ] || listBattle[ id ].def.user.job.passiveFightSkills[ passive.defs.party[ passiveDefsPartyId ].name ].lv < passive.defs.party[ passiveDefsPartyId ].lv ) {

          listBattle[ id ].def.user.job.passiveFightSkills[ passive.defs.party[ passiveDefsPartyId ].name ] = passive.defs.party[ passiveDefsPartyId ];

        }

      }

      // aplica skill passiva enemy do grupo de def
      var passiveDefsEnemyId = 0,
          passiveDefsEnemyLength = passive.defs.enemy.length;
      for( ; passiveDefsEnemyId < passiveDefsEnemyLength ; passiveDefsEnemyId = passiveDefsEnemyId + 1 ) {

        if( !listBattle[ id ].atk.user.job.passiveFightSkills ) {

          listBattle[ id ].atk.user.job.passiveEnemyFightSkills = {};

        }

        if( !listBattle[ id ].atk.user.job.passiveEnemyFightSkills[ passive.defs.enemy[ passiveDefsEnemyId ].name ] || listBattle[ id ].atk.user.job.passiveEnemyFightSkills[ passive.defs.enemy[ passiveDefsEnemyId ].name ].lv < passive.defs.enemy[ passiveDefsEnemyId ].lv ) {

          listBattle[ id ].atk.user.job.passiveEnemyFightSkills[ passive.defs.enemy[ passiveDefsEnemyId ].name ] = passive.defs.enemy[ passiveDefsEnemyId ];

        }

      }

    }

    return listBattle;

  }

  function getCompleteSkill( name, lv, skills ) {

    var skill = false;

    if( skills[ name ] ) {

      var id = 0;
      for( id in skills[ name ] ) {

        if( skills[ name ][ id ].lv === lv && skills[ name ][ id ].name === name ) {

          skill = skills[ name ][ id ];

          break;

        }

      }

    }

    return skill;

  }

  function battle( listBattle ) {

    listBattle = applyPassiveFightSkills( listBattle );

    var active = {}

    active.atks = {};
    active.atks.party = [];
    active.atks.enemy = [];
    active.defs = {};
    active.defs.party = [];
    active.defs.enemy = [];

    var count = 0,
        turns = 0;

    do {

      var id = 0,
          listBattleLength = listBattle.length;
      for( ; id < listBattleLength ; id = id + 1 ) {

        // ATK
        var skillAtkId = 0,
            skillsAtk = listBattle[ id ].atk.skills,
            skillsAtkLength = skillsAtk.length;
        for( ; skillAtkId < skillsAtkLength ; skillAtkId = skillAtkId + 1 ) {
          var skill = getCompleteSkill( skillsAtk[ skillAtkId ].name, skillsAtk[ skillAtkId ].lv, listBattle[ id ].atk.user.job.skills );

          if( skill && listBattle[ id ].atk.user.job.turns > turns ) {

            listBattle[ id ].atk.user.jobRef = clone( listBattle[ id ].atk.user.job );

            // armazena skill de area para party
            if( skill.effective === 'Area-party' ) {

              active.atks.party.push( skill );

            // armazena skill de area para enemy
            } else if( skill.effective === 'Area-enemy' ) {

              active.atks.enemy.push( skill );

            // aplica skill no proprio usuario
            } else if( skill.effective === 'Single' ) {

              // aplicar em si de referencia

              // jobAtk = skill.recipe( jobAtk );

            // aplica skill no enemy
            } else if( skill.effective === 'Single-enemy' ) {

              // aplicar no inimigo DE REFERENCIA

              // jobDef = skill.recipe( jobDef );

            }

          }

        }

        // DEF
        var skillDefId = 0,
            skillsDef = listBattle[ id ].def.skills,
            skillsDefLength = skillsDef.length;
        for( ; skillDefId < skillsDefLength ; skillDefId = skillDefId + 1 ) {
          var skill = getCompleteSkill( skillsDef[ skillDefId ].name, skillsDef[ skillDefId ].lv, listBattle[ id ].def.user.job.skills );

          if( skill && listBattle[ id ].def.user.job.turns > turns ) {

            listBattle[ id ].def.user.jobRef = clone( listBattle[ id ].def.user.job );

            // armazena skill de area para party
            if( skill.effective === 'Area-party' ) {

              active.def.party.push( skill );

            // armazena skill de area para enemy
            } else if( skill.effective === 'Area-enemy' ) {

              active.def.enemy.push( skill );

            // aplica skill no proprio usuario
            } else if( skill.effective === 'Single' ) {

              // aplicar em si de referencia

              // jobDef = skill.recipe( jobDef );

            // aplica skill no enemy
            } else if( skill.effective === 'Single-enemy' ) {

              // aplicar no inimigo DE REFERENCIA

              // jobAtk = skill.recipe( jobAtk );

            }

          }

        }

        turns = updateTurns( turns, listBattle[ id ].atk, listBattle[ id ].def );

      }

      // for listbattle
        // for atk active party
          // aplica skill party
        // for atk active enemies
          // aplica skill contra enemies

        // for def active party
          // aplica skill party
        // for def active enemies
          // aplica skill contra enemies

        //if atk passiveEnemyFightSkills
          // for atk passiveEnemyFightSkills
            // aplica passiveEnemyFightSkills em si

        //if atk passiveFightSkillsStatus
          // for atk passiveFightSkills
            // aplica passiveFightSkills em si

        //if def passiveEnemyFightSkills
          // for def passiveEnemyFightSkills
            // aplica passiveEnemyFightSkills em si

        //if def passiveFightSkillsStatus
          // for def passiveFightSkills
            // aplica passiveFightSkills em si

        // turns = updateTurns( turns, listBattle[ id ].atk, listBattle[ id ].def );

        // calcula single battle usando souls e herois do user
        // debita nos atributos do user

      count = count + 1;

    } while( count < turns );

    // atualiza a action
    // atualiza os usuarios
    // encerra a action

  }

  function updateTurns( turns, atk, def ) {


    if( turns < atk.user.job.turns ) {

      turns = atk.user.job.turns;

    }

    if( turns < def.user.job.turns ) {

      turns = def.user.job.turns;

    }

    return turns;

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

    } else {

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
            job: bigger[ id ].job,
            nick: bigger[ id ].nick,
            souls: bigger[ id ].souls,
            skills: bigger[ id ].skills,
            user: cache.users[ bigger[ id ].nick ]
          },
          'def': {
            job: lesser[ memo ].job,
            nick: lesser[ memo ].nick,
            souls: lesser[ memo ].souls,
            skills: lesser[ memo ].skills,
            user: cache.users[ lesser[ memo ].nick ]
          }
        } );

      } else {

        listBattle.push( {
          'def': {
            job: bigger[ id ].job,
            nick: bigger[ id ].nick,
            souls: bigger[ id ].souls,
            skills: bigger[ id ].skills,
            user: cache.users[ bigger[ id ].nick ]
          },
          'atk': {
            job: lesser[ memo ].job,
            nick: lesser[ memo ].nick,
            souls: lesser[ memo ].souls,
            skills: lesser[ memo ].skills,
            user: cache.users[ lesser[ memo ].nick ]
          }
        } );
      }

      return memo;

    }, 0 );


    return listBattle;

  }

  function treatPassiveFightSkills( user ) {

    var listSkills = {};

    listSkills.passive = {};

    var skills = user.job.skills,
        skillUpgrades = user.skillUpgrades;

    var id = 0;
    for( id in skills ) {

      var skillId = 0,
          skillLength = skills[ id ].length;
      for( ; skillId < skillLength ; skillId = skillId + 1 ) {

        var skillUpgradesId = 0,
            skillUpgradesLength = skillUpgrades.length;
        for( ; skillUpgradesId < skillUpgradesLength ; skillUpgradesId = skillUpgradesId + 1 ) {

          if( skillUpgrades[ skillUpgradesId ].skill === skills[ id ][ skillId ].name ) {

            if( skills[ id ][ skillId ].type === 'Passive-in-fight' ) {

              listSkills.passive[ skills[ id ][ skillId ].name ] = skills[ id ][ skillId ];

            }

          }

        }

      }

    }

    user.job.skillsFight = listSkills;

    return user;

  }

  function treatUsers( users ) {

    var list = {};

    var id = 0,
        usersLength = users.length;
    for( ; id < usersLength ; id = id + 1 ) {

      var user = treatPassiveFightSkills( users[ id ] );

      list[ users[ id ].nick ] = user;

    }

    return list;

  }

  promiseAction
    .then( function( action ) {

      if( action ) {

        var users = _.pluck( _.union( action.atks, action.defs ), 'nick' );

        var promiseUser = userDao.findList( users );

        promiseUser
          .then( function( users ) {

            if( users ) {

              // pq eu peguei esse obj cache para armazenar os users? poderia ser um objeto local e nao o "PRINCIPAL" do sistema ¬¬"
              cache.users = treatUsers( users );

              treatBattle( action );

            } else {



            }

          } );

      } else {

        console.log( 'bleeeh' );

      }



        // armazenar no doc as batalhas
        // loop nas batalhas pra somar cada resultado
        // maior pontuacao de def ou atk ganha mais X pontos

        // subrai os pontos perdidos e adiciona pontos ganhos por participacao
        // soma pontos para a equipe vencedora

        // atualizar users

        // armazena resultado e desativa action



    } );

};