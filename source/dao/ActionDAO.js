module.exports = ( function() {

  var ActionDAO = function( mongoose ) {

    var schema = require( '../model/Action' ),
        actionSchema = mongoose.Schema( schema );

    var Action = mongoose.model( 'Action', actionSchema );

    return {
      save: function( action, success, fail ) {


      }
    };

  };

  return SkillDAO;

} () );