module.exports = function( req ) {

  req.assert( 'password', 'min-max' ).len( 6, 20 );
  req.assert( 'password', 'diferent' ).equals( req.body[ 're-password' ] );

  var errors = req.validationErrors( true );

  return errors;

};