module.exports = ( function() {

  var Schedule = function() {

    var moment = require( 'moment' ),
        cron = {},
        queue = [];

    return {
      start: function( delay, userDao ) {

        var that = this,
            promiseUserSkill = userDao.findSkillUpgrading();

        function success() {

          cron = setInterval( ping, delay, queue );

          function ping( queue ) {

            console.log( queue );

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

        promiseUserSkill
          .then( function( users ) {

            if( users ) {

              var user = 0,
                  usersLength = users.length;
              for( ; user < usersLength ; user = user + 1 ) {

                var skill = 0, skillUpgradingLength = users[ user ].skillUpgrading.length;
                for( ; skill < skillUpgradingLength ; skill = skill + 1 ) {

                  var _user = users[ user ],
                      _skillUpgrading = users[ user ].skillUpgrading[ skill ];

                  that.add( {
                    'id': 'skill-' + users[ user ].skillUpgrading[ skill ].lv + '-' + users[ user ]._id,
                    'schedule': users[ user ].skillUpgrading[ skill ].schedule,
                    'callback': function() {

                      var promiseUserSkillUserUpgrade = userDao.updateSkillUpgrade( _user.nick, _skillUpgrading );

                      promiseUserSkillUserUpgrade
                        .then( function( user ) {

                          if( user ) {

                            console.log( user );

                          }

                        } );

                    }
                  } );

                };

              };

            }

            success();

          } );

        return promiseUserSkill;

      },
      add: function( data ) {

        queue.push( { 'id': data.id, 'expire': data.schedule, 'callback': data.callback } );

      },
      rm: function( refer ) {

        var id = 0, length = queue.length;
        for( ; id < length ; id = id + 1 ) {

          if( queue[ id ].id === refer ) {

            queue.splice( id, 1 );

            break;

          }


        };

      }
    };

  };

  return Schedule;

} () );