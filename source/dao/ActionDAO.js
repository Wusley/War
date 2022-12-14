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
      updateActionAttack: function( id, attack ) {

        var promise = Action.findOneAndUpdate( { _id: id }, { $push: { 'atks': attack } }, { safe: true, upsert: true } ).exec();

        return promise;

      },
      updateActionDefense: function( id, defense ) {

        var promise = Action.findOneAndUpdate( { _id: id }, { $push: { 'defs': defense } }, { safe: true, upsert: true } ).exec();

        return promise;

      },
      removeActionDefense: function( id, defense ) {

        var promise = Action.findOneAndUpdate( { _id: id }, { $pull: { 'defs': { 'nick': defense } } } ).exec();

        return promise;

      },
      removeActionAttack: function( id, attack ) {

        var promise = Action.findOneAndUpdate( { _id: id }, { $pull: { 'atks': { 'nick': attack } } } ).exec();

        return promise;

      },
      removeActionAttackAndCancel: function( id, attack ) {

        var promise = Action.findOneAndUpdate( { _id: id }, { $pull: { 'atks': { 'nick': attack } }, 'status': false } ).exec();

        return promise;

      },
      findActionsActive: function() {

        var promise = Action.find( { status: true } ).exec();

        return promise;

      },
      findActionsUser: function( nick ) {

        var promise = Action.find( { status: true } ).or( [ { 'target.nick': nick }, { 'atks.nick': { $in: [ nick ] } }, { 'defs.nick': { $in: [ nick ] } } ] ).exec();

        return promise;

      },
      findActionId: function( actionId ) {

        var promise = Action.findOne( { status: true, _id: actionId } ).exec();

        return promise;

      },
      delete: function( id ) {

        var promise = Action
                        .update( { _id: id }, { 'status': false } ).exec();

        return promise;

      }
    };

  };

  return ActionDAO;

} () );