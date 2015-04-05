module.exports = ( function() {

  var ActionDAO = function( mongoose ) {

    var schema = require( '../model/Action' ),
        actionSchema = mongoose.Schema( schema );

    var Action = mongoose.model( 'Action', actionSchema );

    return {
      saveAttack: function( attack, success, fail ) {

       var dao = new Action( attack );

        dao.save( function ( err, attack ) {

          if( !err ) {

            success( attack );

          } else {

            fail();

          }

        } );

      },
      findActionsActive: function() {

        var promise = Action.find( { status: true } ).exec();

        return promise;

      }
    };

  };

  return ActionDAO;

} () );