module.exports = function( req ) {

  req.assert( 'email', 'invalid' ).isEmail();

  var errors = req.validationErrors( true );

  return errors;

};