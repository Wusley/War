module.exports = function( req ) {

  req.assert( 'email', 'invalid' ).isEmail();
  req.assert( 'password', 'min-max' ).len( 6, 20 );

  var errors = req.validationErrors( true );

  return errors;

};