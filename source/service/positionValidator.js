module.exports = function( req ) {

  req.assert( 'latitude', 'required' ).notEmpty();
  req.assert( 'longitude', 'required' ).notEmpty();
  req.assert( 'latitude', 'int' ).isFloat();
  req.assert( 'longitude', 'int' ).isFloat();

  var errors = req.validationErrors( true );

  return errors;

};