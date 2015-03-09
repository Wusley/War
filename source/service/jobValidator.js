module.exports = function( req ) {

  req.assert( 'job', 'required' ).notEmpty();

  var errors = req.validationErrors( true );

  return errors;

};