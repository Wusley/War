module.exports = ( function() {

  var limit = 500, // meters
      kmInMiles = 0.62137; // milers

  limitPosition = limit / kmInMiles; // convert mi to meters

  return {
    'limit-position': limitPosition,
    'radiusInKm': 6378.137,
    'metersPerMinute': 50
  };

} () );