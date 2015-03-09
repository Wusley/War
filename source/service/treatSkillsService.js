module.exports = ( function( req ) {

  var treatSkills = function( skills ) {

    var skills = skills.split( ',' );

    var id;
    for( id in skills ) {

      if( skills.hasOwnProperty( id ) ) {

        skills[ id ] = skills[ id ].trim();

      }

    }

    return skills;

  }

  return treatSkills;

} () );