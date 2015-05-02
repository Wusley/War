module.exports = ( function() {

  var treatAction = require( '../service/treatAction' ),
      treatSkillUpgrading = require( '../service/treatSkillUpgrading' ),
      treatSouls = require( '../service/treatSouls' ),
      scheduleConfig = require('../config/schedule'),
      _ = require( 'underscore' );

  var Schedule = function() {

    var moment = require( 'moment' ),
        cron = {},
        queue = [];

    return {
      start: function( userDao, actionDao, cache ) {

        var that = this,
            load = 2; // 2
            promiseUserSkill = userDao.findSkillUpgrading(),
            promiseAction = actionDao.findActionsActive();

        function success( status ) {

          if( status === 0 ) {

            setInterval( ping, scheduleConfig.delay, queue );

            function ping( queue ) {

              // console.log( queue );

              var id = 0,
                  now = moment(),
                  queueLength = queue.length,
                  rem = [];

              var teste = [];
              for( ; id < queueLength ; id = id + 1 ) {

                if( now.diff( queue[ id ].expire ) >= 0 ) {

                  queue[ id ].callback();

                  rem.push( id );

                }

              };

              if( rem.length ) {

                var remLength = rem.length - 1,
                    remId = remLength;
                for( ; remId >= 0 ; remId = remId - 1 ) {

                  queue.splice( rem[ remId ], 1 );

                }

              }

            }

          }

        }

        promiseAction
          .then( function( actions ) {

            console.log( 'action loaded' );

            if( actions ) {

              var id = 0, actionsLength = actions.length;
              for( ; id < actionsLength ; id = id + 1 ) {

                that.add( treatAction( actions[ id ], actionDao ) );

              };

            }

            load = load - 1;

            success( load );

          } );

        promiseUserSkill
          .then( function( users ) {

            console.log( 'skills upgrading loaded' );

            if( users ) {

              var user = 0,
                  usersLength = users.length;
              for( ; user < usersLength ; user = user + 1 ) {

                var skill = 0,
                    skillUpgradingLength = users[ user ].skillUpgrading.length;
                for( ; skill < skillUpgradingLength ; skill = skill + 1 ) {

                  var skillUpgrading = users[ user ].skillUpgrading[ skill ];

                  that.add( treatSkillUpgrading( users[ user ].nick, skillUpgrading, userDao ) );

                }

              }

            }

            load = load - 1;

            success( load );

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

          }

        }


      }
    };

  };

  return Schedule;

} () );