module.exports = function( req ) {

  console.log(req.params);

  req.assert( 'souls', 'min' ).gte( 1 );
  req.assert( 'skills', 'required' ).notEmpty();

  var errors = req.validationErrors( true );

  return errors;

};