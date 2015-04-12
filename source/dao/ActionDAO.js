module.exports = ( function() {

  var ActionDAO = function( mongoose ) {

    var schema = require( '../model/Action' ),
        actionSchema = mongoose.Schema( schema );

    var Action = mongoose.model( 'Action', actionSchema );

    return {
      saveAttack: function( attack, response ) {

       var dao = new Action( attack );

        dao.save( function ( err, action ) {

          if( !err ) {

            response.success( { 'action': action } );

          } else {

            response.fail( 'server' );

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