module.exports = function( mongoose, Schema ) {

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
      findEmail: function( email ) {

        var promise = User.findOne( { email: email } ).exec();

        return promise;

      },
      list: function() {

        var promise = User.findOne().exec();

        return promise;

      }
    };
  };

  return new UserDAO( mongoose, Schema );

};