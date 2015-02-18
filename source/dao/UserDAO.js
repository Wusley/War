module.exports = function( mongoose, Schema ) {

  var crypto = require('crypto');

  var UserDAO = function( mongoose, Schema ) {

    var userSchema = mongoose.Schema( Schema ),
        User = mongoose.model( 'User', userSchema );

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
                  'resetPasswordExpires': Date.now() + 3600000,
                  'resetPasswordStatus': true
                };

                user.forgotPassword = forgotPassword;

                var promise = User
                                .update( { _id: user.id }, { 'forgotPassword': forgotPassword }, { multi: true } ).exec();

                promise
                  .then( function() {

                    success( user );

                  } );

              } );

            } else {

              fail();

            }

          } );

      },
      update: function( user ) {

      },
      delete: function( id ) {

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

            var dateNow = Date.now(),
                dateBefore = Date.now() - 3600000,
                dateExpire = Date.now( user.forgotPassword.resetPasswordExpires );

            if( user && dateExpire >= dateBefore && dateExpire <= dateNow && user.forgotPassword.resetPasswordStatus === true ) {

              var promise = User
                              .update( { _id: user.id }, { 'password': password, 'forgotPassword.resetPasswordStatus': false } ).exec();

              promise
                .then( function() {

                  success();

                } );

            } else {

              fail( 'token' );

            }

          } );

      },
      updatePosition: function( nick, latitude, longitude, success, fail ) {

        var promise = User
                        .update( { nick: nick }, { 'position.latitude': latitude, 'position.longitude': longitude } ).exec();

          promise
            .then( function() {

              success();

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

            if( user && user.password === password ) {

              success( user );

            } else {

              fail();

            }

          } );

      },
      list: function() {

        var promise = User.find().exec();

        return promise;

      }
    };
  };

  return new UserDAO( mongoose, Schema );

};