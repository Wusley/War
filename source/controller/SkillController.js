module.exports = function( router, interceptAccess, schedule, skillDao, userDao ) {

  // DEPENDENCIEs
  var checkSkillUpgrade = require( '../service/checkSkillUpgrade' ),
      checkUserSoul = require( '../service/checkUserSoul' ),
      moment = require( 'moment' );

  router.post( '/skill', function( req, res, next ) {

    var client = {};

    function success( skill ) {
      client.cod = 200;
      client.skill = skill;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.skill = null;

      if( status === 'skill' ) {

        client.skill = false;

      }

      res.send( client );
    }

    skillDao.save( req.body, success, fail );

  } );

  router.get( '/skills', function( req, res, next ) {

    var client = {},
        promise = skillDao.findList();

    function success( skills ) {
      client.cod = 200;
      client.skills = skills;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.skills = null;

      if( status === 'skills' ) {

        client.skills = false;

      }

      res.send( client );
    }

    promise.then( function( skills ) {

      if( skills ) {

        success( skills );

      } else {

        fail( 'skills' );

      }

    } );

  } );

  router.get( '/skills/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {},
        promise = userDao.findUser( nick );

    function success( skills, upgrades ) {
      client.cod = 200;
      client.skills = skills;
      client.upgrades = upgrades;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.skills = null;

      if( status === 'skills' ) {

        client.skills = false;
        client.upgrades = false;

      }

      res.send( client );
    }

    promise.then( function( user ) {

      if( user ) {

        success( user.job.skills, user.upgrades );

      } else {

        fail( 'skills' );

      }

    } );

  } );

  router.get( '/skills/:skillName/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        skillName = req.params.skillName,
        client = {},
        promiseUser = userDao.findUser( nick ),
        promiseSkill = skillDao.find( skillName );

    function success( user, skill ) {
      client.cod = 200;

      var upgrading = {
        'lv': skill.lv,
        'skill': skill.name,
        'schedule': moment().add( skill.upgradeTime, 'minutes' )
      };

      var soul = checkUserSoul( user.soul, skill.upgradeSoul );

      function _success( upgrading ) {

        client.cod = 200;
        client.upgrading = upgrading;

        res.send( client );

      }

      function _fail( status ) {

        client.cod = 500;

        if( status === 'soul' ) {

          client.cod = 200;
          client.soul = false;

        }

        res.send( client );

      }

      if( soul >= 0 ) {

        var promiseUserUpgrading = userDao.updateSkillUpgrading( nick, soul, upgrading );

        promiseUserUpgrading
          .then( function( user ) {

            if( user ) {

              schedule.add( {
                'id': 'skill-' + upgrading.lv + '-' + user._id,
                'schedule': upgrading.schedule,
                'callback': function() {

                  var promiseUserUpgrade = userDao.updateSkillUpgrade( nick, upgrading );

                  promiseUserUpgrade
                    .then( function( user ) {

                      if( user ) {

                        console.log( user );

                      }

                    } );

                }
              } );

              _success( user.skillUpgrading );

            } else {

              _fail() ;

            }

          } );

      } else {

        _fail( 'soul' );

      }

    }

    function fail( status, skill ) {
      client.cod = 400;
      client.skill = null;
      client.user = null;
      client.job = null;
      client.upgrading = null;
      client.upgrade = null;

      if( status === 'skill' ) {

        client.skill = false;

      }

      if( status === 'user' ) {

        client.user = false;

      }

      if( status === 'job' ) {

        client.job = false;

      }

      if( status === 'upgrading' ) {

        client.upgrading = false;

      }

      if( status === 'upgrade upgrading' ) {

        var promiseUser = userDao.removeSkillUpgrading( nick, skill );

        promiseUser
          .then( function( user ) {

            if( user ) {

              _success( user.skillUpgrading );

            } else {

              fail( 'upgrade' ) ;

            }

          } );

      }

      if( status === 'upgrade' ) {

        client.upgrade = false;

      }

      function _success( upgrading ) {

        client.cod = 200;
        client.upgrading = upgrading;

        res.send( client );

      }

      res.send( client );
    }

    promiseSkill.then( function( skill ) {

      if( skill ) {

        promiseUser.then( function( user ) {

          if( user ) {

            var status = checkSkillUpgrade( user.job, user.skillUpgrading, user.skillUpgrades, skill.name );

            switch( status ) {
              case 'job': fail( 'job' );
              break;
              case 'upgrade upgrading': fail( 'upgrade upgrading', skill.name );
              break;
              case 'upgrading': fail( 'upgrading' );
              break;
              case 'upgrade': fail( 'upgrade' );
              break;
              default: success( user, skill );
            }

          } else {

            fail( 'user' );

          }

        } );


      } else {

        fail( 'skill' );

      }

    } );

  } );

};
