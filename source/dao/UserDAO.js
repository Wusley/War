module.exports = ( function() {

  var UserDAO = function( mongoose, cache ) {

    var moment = require( 'moment' ),
        crypto = require( 'crypto' ),
        PasswordCrypt = require( '../service/passwordCrypt' ),
        treatUser = require( '../service/treatUser' )( cache.jobs ),
        schema = require( '../model/User' ),
        partyConfig = require( '../config/party' ),
        mapConfig = require( '../config/map' ),
        userSchema = mongoose.Schema( schema );

    userSchema.index( { 'position': '2dsphere' } );

    var User = mongoose.model( 'User', userSchema );

    passwordCrypt = new PasswordCrypt();

    return {
      save: function( user, response ) {

        var that = this,
            findUserPromise = that.findUser( user.nick );

        findUserPromise
          .then( function( nickExist ) {

            if( !nickExist ) {

              var findEmailPromise = that.findEmail( user.email );

              findEmailPromise
                .then( function( emailExist ) {

                  if( !emailExist ) {

                    user.password = passwordCrypt.insurance( user.password );

                    if( user.password ) {

                      var dao = new User( user );

                      dao.save( function ( err, user ) {

                        if( !err ) {

                          response.success( { 'user': user } );

                        } else {

                          response.fail( 'server' );

                        }


                      } );

                    }

                  } else {

                    response.fail( 'email-exist' );

                  }

                } );

            } else {

              response.fail( 'nick-exist' );

            }

        } );

      },
      updateForgotPassword: function( email, response ) {

        var that = this,
            findEmailPromise = that.findEmail( email );

        findEmailPromise
          .then( function( user ) {

            if( user ) {

              crypto.randomBytes( 20, function( err, buf ) {
                var token = buf.toString( 'hex' );

                var forgotPassword = {
                  'resetPasswordToken': token,
                  'resetPasswordExpires': moment().add( 1, 'hours' ),
                  'resetPasswordStatus': true
                };

                user.forgotPassword = forgotPassword;

                var promise = User
                                .update( { _id: user.id }, { 'forgotPassword': forgotPassword }, { multi: true } ).exec();

                promise
                  .then( function( result ) {

                    if( result.ok > 0 ) {

                      response.success( { 'user': user } );

                    } else {

                      response.fail();

                    }

                  } );

              } );

            } else {

              response.fail( 'user' );

            }

          } );

      },
      findId: function( id ) {

        var promise = User.findOne( { _id: id } ).lean().exec( treatUser );

        return promise;

      },
      findUser: function( nick ) {

        var promise = User.findOne( { nick: nick } ).lean().exec( treatUser );

        return promise;

      },
      findToken: function( token ) {

        var promise = User.findOne( { 'forgotPassword.resetPasswordToken': token } ).lean().exec( treatUser );

        return promise;

      },
      updatePassword: function( token, password, response ) {

        var that = this,
            findTokenPromise = that.findToken( token );

        findTokenPromise
          .then( function( user ) {

            var dateNow = moment(),
                dateExpire = user.forgotPassword.resetPasswordExpires;

            if( user ) {

              if( dateNow.diff( dateExpire ) < 0 && user.forgotPassword.resetPasswordStatus === true ) {

                var promise = User
                                .update( { _id: user.id }, { 'password': password, 'forgotPassword.resetPasswordStatus': false } ).exec();

                promise
                  .then( function( result ) {

                    if( result.ok > 0 ) {

                      response.success( { 'user': user } );

                    } else {

                      response.fail( 'server' );

                    }

                  } );

              } else {

                response.fail( 'expired' );

              }


            } else {

              response.fail( 'token' );

            }

          } );

      },
      updatePosition: function( nick, latitude, longitude, response ) {

        var position = [ parseFloat( latitude ), parseFloat( longitude ) ],
            promise = User
                        .update( { nick: nick }, { 'position': position } ).lean().exec( treatUser );

          promise
            .then( function( result ) {

            if( result.ok > 0 ) {

                response.success( { 'nick': user.nick, 'position': user.position } );

              } else {

                response.fail( 'server' );

              }

            } );

      },
      updateJob: function( nick, job, response ) {

        var promise = User
                        .update( { nick: nick }, { 'job': job } ).lean().exec( treatUser );

        promise
          .then( function( result ) {

            if( result.ok > 0 ) {

              response.success( { 'job': job } );

            } else {

              response.fail() ;

            }

          } );

      },
      findSkillUpgrading: function() {

        var promise = User
                        .find( { 'skillUpgrading': { $exists: true, $not: { $size: 0 } } } ).lean().exec( treatUser );

        return promise;

      },
      updateSkillUpgrading: function( nick, souls, upgrading ) {

        var promise = User
                        .findOneAndUpdate( { nick: nick }, { 'souls': souls, $push: { 'skillUpgrading': upgrading } } ).lean().exec( treatUser );

        return promise;

      },
      updateSkillUpgrade: function( nick, upgrading ) {

        var promise = User
                        .findOneAndUpdate( { nick: nick }, { $pull: { 'skillUpgrading': { 'skill': upgrading.skill } }, $push: { 'skillUpgrades': upgrading } }, { multi: true } ).lean().exec( treatUser );

        return promise;

      },
      updatePay: function( nick, souls ) {

        var promise = User
                        .findOneAndUpdate( { nick: nick }, { souls: souls } ).lean().exec( treatUser );

        return promise;

      },
      removeSkillUpgrading: function( nick, skill ) {

        var promise = User
                        .findOneAndUpdate( { nick: nick }, { $pull: { 'skillUpgrading': { 'skill': skill } } } ).lean().exec( treatUser );

        return promise;

      },
      findEmail: function( email ) {

        var promise = User.findOne( { email: email } ).exec();

        return promise;

      },
      authenticate: function( email, password, response ) {

        var that = this,
            findEmailPromise = that.findEmail( email );

        findEmailPromise
          .then( function( user ) {

            if( user ) {

              password = passwordCrypt.compare( user.password, password );

              if( password ) {

                response.success( { 'user': user } );

              } else {

                response.fail( 'password' );

              }

            } else {

              response.fail( 'user' );

            }

          } );

      },
      findList: function( users ) {

        var promise;

        if( users ) {

          promise = User.find().where( { 'nick': { $in: users } } ).lean().exec( treatUser );

        } else {

          promise = User.find().lean().exec( treatUser );

        }

        return promise;

      },

      // ORDER BY NEARBY
      findUserNearby: function( position, nick, distance ) {

        distance = distance || partyConfig.maxDistance;

        var maxDistance = ( ( 1 /  partyConfig.kmReference ) /  1000 ) * distance,
            nick = nick || '';

        var promise = User.where( 'position' ).nearSphere( { center: position, maxDistance: maxDistance } ).where( 'nick' ).ne( nick ).lean().exec( treatUser );

        return promise;

      },

      // ORDER BY NEARBY
      findEnemyNearby: function( position, distance, except ) {

        var maxDistance = ( ( 1 /  partyConfig.kmReference ) /  1000 ) * distance;

        var promise = User.where( 'position' ).nearSphere( { center: position, maxDistance: maxDistance } ).where( 'nick' ).nin( except ).lean().exec( treatUser );

        return promise;

      },

      findUserTargetAndDistance: function( user, targetNick, response ) {

        var promise = User.geoNear( user.position, { spherical : true, distanceMultiplier: mapConfig.radiusInKm, query: { 'nick': targetNick } }, function( err, target, stats ) {

          if( !err ) {

            response.success( { 'user': user, 'target': target[ 0 ] } );

          } else {

            response.fail( 'server' );

          }

        } );
      }

    };

  };

  return UserDAO;

} () );