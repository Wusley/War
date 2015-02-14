var UserDAO = function UserDAO( mongoose, Schema ) {

  this.userSchema = mongoose.Schema( Schema );

  this.User = mongoose.model( 'User', this.userSchema );

  return {
    save: function( user ) {

      var dao = new this.User( user );

      dao.save( function() {

        if( err ) return console.error( err );
        return true;

      } );

    },
    update: function( user ) {

    },
    delete: function( id ) {

    },
    find: function( id ) {

    },
    list: function() {

      this.User.find( function ( err, Users ) {

        if(err) return console.error(err);
        return Users;

      } );

    }
  };

};