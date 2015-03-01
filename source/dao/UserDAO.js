module.exports = ( function() {

  var UserDAO = function( mongoose ) {

    var moment = require( 'moment' ),
        crypto = require( 'crypto' ),
        schema = require( '../model/User' ),
        userSchema = mongoose.Schema( schema );

        userSchema.index( { 'position': '2d' } );

    var User = mongoose.model( 'User', userSchema );

    return {
      save: function( user, success, fail ) {

        var that = this,
            findNickPromise = that.findNick( user.nick );

        findNickPromise
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
      findNick: function( nick ) {

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

        var promise = User
                        .update( { nick: nick }, { 'position': [ parseFloat( latitude ), parseFloat( longitude ) ] } ).exec();

          promise
            .then( function( status, details ) {

              if( !details.err ) {

                success();

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
      list: function() {

        var promise = User.find().exec();

        return promise;

      },


      findGeo: function() {

        //find(    { loc : { '$near' : [4.881213, 52.366455] } }    ).limit(5).exec(console.log);

        var promise = User.find( { 'position': { '$near' : [ -23.54124848329108, -46.1575984954834 ] } } ).limit( 5 ).exec( console.log );

        // console.log('teste');
        promise.then( function() {


          console.log( arguments );

        } );

      }








    };

  };

  return UserDAO;

} () );