module.exports = ( function() {

  var mapConfig = require( '../config/map' );

  var castTime = function( distance ) {

    var time = Math.ceil( distance / mapConfig.metersPerMinute );

    var cast = time < mapConfig.minTime ? mapConfig.minTime : time;

    return cast;

  }

  return castTime;

} () );
