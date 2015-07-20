module.exports = ( function() {

  var sliceAvaliableSkills = function( skills ) {

    return skills.split( ', ' );

  }

  return sliceAvaliableSkills;

} () );