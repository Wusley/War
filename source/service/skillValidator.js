module.exports = function( req ) {

  req.assert( 'type', 'required' ).notEmpty();
  req.assert( 'name', 'required' ).notEmpty();
  req.assert( 'lv', 'min' ).gte( 1 );
  req.assert( 'lv', 'invalid' ).isInt();
  req.assert( 'description', 'required' ).notEmpty();
  req.assert( 'souls', 'min' ).gte( 1 );
  req.assert( 'souls', 'invalid' ).isInt();
  req.assert( 'upgradeSouls', 'min' ).gte( 1 );
  req.assert( 'upgradeSouls', 'invalid' ).isInt();
  req.assert( 'upgradeTime', 'min' ).gte( 1 );
  req.assert( 'upgradeTime', 'invalid' ).isInt();
  req.assert( 'turns', 'min' ).gte( 1 );
  req.assert( 'turns', 'invalid' ).isInt();
  req.assert( 'recipe', 'required' ).notEmpty();

  var errors = req.validationErrors( true );

  return errors;

};