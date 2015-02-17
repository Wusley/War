module.exports = function( req ) {

  req.assert( 'name', 'min' ).len( 3 );
  req.assert( 'nick', 'min' ).len( 3 );
  req.assert( 'email', 'invalid' ).isEmail();
  req.assert( 'password', 'min-max' ).len( 6, 20 );
  req.assert( 'password', 'diferent' ).equals( req.body[ 're-password' ] );

  var errors = req.validationErrors( true );

  return errors;

};