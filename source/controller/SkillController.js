module.exports = function( router, interceptAccess, schedule, skillDao, userDao, cache ) {

  // DEPENDENCIEs
  var checkSkillUpgrade = require( '../service/checkSkillUpgrade' ),
      treatAvaliableSkillS = require( '../service/treatAvaliableSkillS' ),
      checkUserSouls = require( '../service/checkUserSouls' ),
      treatSkillUpgrading = require( '../service/treatSkillUpgrading' ),
      treatResponse = require( '../service/treatResponse' ),
      moment = require( 'moment' ),
      clone = require( 'clone' );

  router.post( '/skill', function( req, res, next ) {

    var response = treatResponse( res );

    skillDao.save( req.body, response );

  } );

  router.get( '/skills', function( req, res, next ) {

    var response = treatResponse( res ),
        promise = skillDao.findList();

    promise.then( function( skills ) {

      if( skills ) {

        response.success( { 'skills': skills } );

      } else {

        response.fail( 'skills' );

      }

    } );

  } );

  router.get( '/skills/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        promise = userDao.findNick( nick );

    promise.then( function( user ) {

      if( user ) {

        var skills = treatAvaliableSkillS( clone( user.job.skills ), user.skillUpgrades, user.skillUpgrading );

        response.success( { 'skills': skills } );

      } else {

        response.fail( 'user' );

      }

    } );

  } );

  router.get( '/skills/:skillId/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        skillId = req.params.skillId,
        response = treatResponse( res ),
        promiseUser = userDao.findNick( nick ),
        promiseSkill = skillDao.findId( skillId );

    promiseSkill.then( function( skill ) {

      if( skill ) {

        promiseUser.then( function( user ) {

          if( user ) {

            var status = checkSkillUpgrade( clone( user.job.skills ), user.skillUpgrading, user.skillUpgrades, skill._id );

            switch( status ) {
              case 'job': response.fail( 'job' );
              break;

              case 'upgrade upgrading':

                var promiseUser = userDao.removeSkillUpgrading( user.nick, skill.name );

                promiseUser
                  .then( function( user ) {

                    if( user ) {

                      response.success( { 'skillUpgrading': user.skillUpgrading } );

                    } else {

                      response.fail( 'upgrade' ) ;

                    }

                  } );

              break;

              case 'upgrading': response.fail( 'upgrading' );
              break;

              case 'upgrade': response.fail( 'upgrade' );
              break;

              case 'overTraining': response.fail( 'overTraining' );
              break;

              case 'underTraining': response.fail( 'underTraining' );
              break;

              // upgrading
              default:

                var skillUpgrading = {
                  'id': skill._id,
                  'lv': skill.lv,
                  'skill': skill.name,
                  'schedule': moment().add( skill.upgradeTime, 'minutes' )
                };

                var souls = checkUserSouls( user.souls, skill.upgradeSouls );

                if( souls >= 0 ) {

                  var promiseUserUpgrading = userDao.updateSkillUpgrading( nick, souls, skillUpgrading );

                  promiseUserUpgrading
                    .then( function( user ) {

                      if( user ) {

                        schedule.add( treatSkillUpgrading( nick, skillUpgrading, userDao ) );

                        response.success( { 'skillUpgrading': user.skillUpgrading } );

                      } else {

                        response.fail( 'server' );

                      }

                    } );

                } else {

                  response.fail( 'souls' );

                }

            }

          } else {

            response.fail( 'empty-user' );

          }

        } );

      } else {

        response.fail( 'empty-skill' );

      }

    } );

  } );

};
