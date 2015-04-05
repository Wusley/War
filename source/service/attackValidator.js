module.exports = function( req ) {

  req.assert( 'target', 'invalid' ).notEmpty();
  req.assert( 'title', 'min-max' ).len( 3, 45 );
  req.assert( 'souls', 'min' ).gte( 1 );
  req.assert( 'skills', 'invalid' ).notEmpty();

  var errors = req.validationErrors( true );

  return errors;

};