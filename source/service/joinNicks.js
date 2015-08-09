module.exports = ( function() {

  var joinNicks = function( atks, target, defs ) {

    var _ = require( 'underscore' );

    var users = _.union( atks, target, defs );

    return _.pluck( users, 'nick' );

  }

  return joinNicks;

} () );