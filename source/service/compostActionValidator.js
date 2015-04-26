module.exports = function( req ) {

  req.assert( 'souls', 'min' ).gte( 1 );
  req.assert( 'skills', 'invalid' ).notEmpty();

  var errors = req.validationErrors( true );

  return errors;

};