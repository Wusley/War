module.exports = {
  passiveSkills: function( user ) {

    if( user && user.skillUpgrades ) {

      var id = 0,
          skillsLength = user.skillUpgrades.length;
      for( ; id < skillsLength; id = id + 1 ) {

        console.log( user.skillUpgrades[ id ].name );

      }

      return user;

    }

  }

};