  module.exports = ( function() {

  var UserDAO = function( mongoose, cache ) {

    var moment = require( 'moment' ),
        crypto = require( 'crypto' ),
        PasswordCrypt = require( '../service/passwordCrypt' ),
        treatUser = require( '../service/treatUser' ),
        schema = require( '../model/User' ),
        partyConfig = require( '../config/party' ),
        userSchema = mongoose.Schema( schema );

    userSchema.index( { 'position': '2dsphere' } );

    var User = mongoose.model( 'User', userSchema );

    passwordCrypt = new PasswordCrypt();

    return {
      save: function( user, success, fail ) {

        var that = this,
            findUserPromise = that.findUser( user.nick );

        findUserPromise
          .then( function( nck ) {

            if( !nck ) {

              var findEmailPromise = that.findEmail( user.email );

              findEmailPromise
                .then( function( eml ) {

                  if( !eml ) {

                    user.password = passwordCrypt.insurance( user.password );

                    if( user.password ) {

                      var dao = new User( user );

                      dao.save( function ( err, user ) {

                        if(err) return console.error( err );

                        success( user );

                      } );

                    }

                  } else {

                    fail( 'email' );

                  }

                } );

            } else {

              fail( 'nick' );

            }

        } );

      },
      updateForgotPassword: function( email, success, fail ) {

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
                  .then( function( status, details ) {

                    if( !details.err ) {

                      success( user );

                    } else {

                      fail();

                    }

                  } );

              } );

            } else {

              fail( 'user' );

            }

          } );

      },
      findId: function( id ) {

        var promise = User.findOne( { _id: id } ).exec();

        return promise;

      },
      findUser: function( nick ) {

        var promise = User.findOne( { nick: nick } ).exec();

        return promise;

      },
      findToken: function( token ) {

        var promise = User.findOne( { 'forgotPassword.resetPasswordToken': token } ).exec();

        return promise;

      },
      updatePassword: function( token, password, success, fail ) {

        var that = this,
            findTokenPromise = that.findToken( token );

        findTokenPromise
          .then( function( user ) {

            var dateNow = moment(),
                dateExpire = user.forgotPassword.resetPasswordExpires;

            if( user ) {

              if( dateNow.diff( dateExpire ) < 0 && user.forgotPassword.resetPasswordStatus === true ) {

                var promise = User
                                .findOneAndUpdate( { _id: user.id }, { 'password': password, 'forgotPassword.resetPasswordStatus': false } ).exec();

                promise
                  .then( function( status, details ) {

                    if( !details.err ) {

                      success( user );

                    } else {

                      fail();

                    }

                    success();

                  } );

              } else {

                fail( 'expired' );

              }


            } else {

              fail( 'token' );

            }

          } );

      },
      updatePosition: function( nick, latitude, longitude, success, fail ) {

        var position = [ parseFloat( latitude ), parseFloat( longitude ) ],
            promise = User
                        .findOneAndUpdate( { nick: nick }, { 'position': position } ).exec();

          promise
            .then( function( status, details ) {

              if( !details.err ) {

                success( nick, position );

              } else {

                fail();

              }

            } );

      },
      updateJob: function( nick, job, success, fail ) {

        var promise = User
                        .findOneAndUpdate( { nick: nick }, { 'job': job } ).exec();

        promise
          .then( function( status, details ) {

            if( !details.err ) {

              success( nick, job );

            } else {

              fail() ;

            }

          } );

      },
      findSkillUpgrading: function() {

        var promise = User
                        .find( { 'skillUpgrading': { $exists: true, $not: { $size: 0 } } } ).exec();

        return promise;

      },
      updateSkillUpgrading: function( nick, soul, upgrading, success, fail ) {

        var promise = User
                        .findOneAndUpdate( { nick: nick }, { 'soul': soul, $push: { 'skillUpgrading': upgrading } } ).exec();

        return promise;

      },
      updateSkillUpgrade: function( nick, upgrading ) {

        var promise = User
                        .findOneAndUpdate( { nick: nick }, { $pull: { 'skillUpgrading': { 'skill': upgrading.skill } }, $push: { 'skillUpgrades': upgrading } }, { multi: true } ).exec();

        return promise;

      },
      removeSkillUpgrading: function( nick, skill ) {

        var promise = User
                        .findOneAndUpdate( { nick: nick }, { $pull: { 'skillUpgrading': { 'skill': skill } } } ).exec();

        return promise;

      },
      findEmail: function( email ) {

        var promise = User.findOne( { email: email } ).exec();

        return promise;

      },
      authenticate: function( email, password, success, fail ) {

        var that = this,
            findEmailPromise = that.findEmail( email );

        findEmailPromise
          .then( function( user ) {

            if( user ) {

              password = passwordCrypt.compare( user.password, password );

              if( password ) {

                success( user );

              } else {

                fail( 'password' );

              }

            } else {

              fail( 'user' );

            }

          } );

      },
      findList: function( users ) {

        var promise;

        if( users ) {

          promise = User.find().where( { 'nick': { $in: users } } ).exec();

        } else {

          promise = User.find().exec();

        }

        return promise;

      },

      // ORDER BY NEARBY
      findUserNearby: function( position, nick, distance ) {

        distance = distance || partyConfig.maxDistance;

        var maxDistance = ( ( 1 /  partyConfig.kmReference ) /  1000 ) * distance,
            nick = nick || '';

        var promise = User.where( 'position' ).nearSphere( { center: position, maxDistance: maxDistance } ).where( 'nick' ).ne( nick ).exec();

        return promise;

      },

      // ORDER BY NEARBY
      findEnemyNearby: function( position, distance, except ) {

        var maxDistance = ( ( 1 /  partyConfig.kmReference ) /  1000 ) * distance;

        var promise = User.where( 'position' ).nearSphere( { center: position, maxDistance: maxDistance } ).where( 'nick' ).nin( except ).lean().exec( function( err, data ) {

          if( !err ) {

            treatUser( data, cache.jobs );

          } else {

            console.log( err );

          }

        } );

        return promise;

      }

    };

  };

  return UserDAO;

} () );