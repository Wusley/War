module.exports = function( req ) {

  console.log('teste');

  req.assert( 'job', 'required' ).notEmpty();

  var errors = req.validationErrors( true );

  return errors;

};