module.exports = ( function() {

  var UserDAO = function( mongoose ) {

    var moment = require( 'moment' ),
        crypto = require( 'crypto' ),
        schema = require( '../model/User' ),
        partyConfig = require( '../config/party' ),
        userSchema = mongoose.Schema( schema );

        userSchema.index( { 'position': '2dsphere' } );

    var User = mongoose.model( 'User', userSchema );

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

                    var dao = new User( user );

                    dao.save( function ( err, user ) {

                      if(err) return console.error( err );

                      success( user );

                    } );

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
                                .update( { _id: user.id }, { 'password': password, 'forgotPassword.resetPasswordStatus': false } ).exec();

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
                        .update( { nick: nick }, { 'position': position } ).exec();

          promise
            .then( function( status, details ) {

              if( !details.err ) {

                success( nick, position );

              } else {

                fail();

              }

            } );

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

              if( user.password === password ) {

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

          promise = User.find().where( { 'nick': { $in: users } } ).exec( console.log );

        } else {

          promise = User.find().exec();

        }

        return promise;

      },

      // ORDER BY NEARBY
      findUserNearby: function( position, nick ) {

        var maxDistance = ( ( 1 /  partyConfig.kmReference ) /  1000 ) * partyConfig.maxDistance,
            nick = nick || '';

        // var promise = User.find( { 'nick': { $in: [ 'etc', 'wusley' ] } } ).where( 'position' ).nearSphere( { center: position, maxDistance: maxDistance } ).exec();
        var promise = User.where( 'position' ).nearSphere( { center: position, maxDistance: maxDistance } ).where( 'nick' ).ne( nick ).exec();

        return promise;

      }

    };

  };

  return UserDAO;

} () );