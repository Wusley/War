module.exports = ( function() {

  var treatAction = require( '../service/treatAction' ),
      treatSkillUpgrading = require( '../service/treatSkillUpgrading' );

  var Schedule = function() {

    var moment = require( 'moment' ),
        cron = {},
        queue = [];

    return {
      start: function( delay, userDao, actionDao ) {

        var that = this,
            promiseUserSkill = userDao.findSkillUpgrading(),
            promiseAction = actionDao.findActionsActive();

        function success() {

          cron = setInterval( ping, delay, queue );

          function ping( queue ) {

            // console.log( queue );

            var id = 0, length = queue.length, now = moment();
            for( ; id < length ; id = id + 1 ) {

              if( now.diff( queue[ id ].expire ) >= 0 ) {

                queue[ id ].callback();

                queue.splice( id, 1 );

                break;

              }

            };

          }

        }

        promiseAction
          .then( function( actions ) {

            if( actions ) {

              var id = 0, actionsLength = actions.length;
              for( ; id < actionsLength ; id = id + 1 ) {

                that.add( treatAction( actions[ id ], actionDao ) );

              };

            }

          } );

        promiseUserSkill
          .then( function( users ) {

            if( users ) {

              var user = 0,
                  usersLength = users.length;
              for( ; user < usersLength ; user = user + 1 ) {

                var skill = 0,
                    skillUpgradingLength = users[ user ].skillUpgrading.length;
                for( ; skill < skillUpgradingLength ; skill = skill + 1 ) {

                  var skillUpgrading = users[ user ].skillUpgrading[ skill ];

                  that.add( treatSkillUpgrading( users[ user ].nick, skillUpgrading, userDao ) );

                };

              };

            }

            success();

          } );

        return promiseUserSkill;

      },
      add: function( data ) {

        if( data ) {

          queue.push( { 'expire': data.schedule, 'callback': data.callback } );

        }

      },
      rm: function( refer ) {

        if( refer ) {

          var id = 0, length = queue.length;
          for( ; id < length ; id = id + 1 ) {

            if( queue[ id ].id === refer ) {

              queue.splice( id, 1 );

              break;

            }

          };

        }


      }
    };

  };

  return Schedule;

} () );