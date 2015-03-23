module.exports = ( function() {

  var SkillDAO = function( mongoose ) {

    var schema = require( '../model/Skill' ),
        skillSchema = mongoose.Schema( schema );

    var Skill = mongoose.model( 'Skill', skillSchema );

    return {
      save: function( skill, success, fail ) {

        var that = this,
            findPromise = that.find( skill.name );

        findPromise.then( function( skills ) {

          if( !skills ) {

            var dao = new Skill( skill );

            dao.save( function ( err, skill ) {

              if( err ) return console.error( err );

              success( skill );

            } );

          } else {

            fail( 'skill' );

          }

        } );

      },
      find: function( name ) {

        var promise = Skill.findOne( { name: name } ).exec();

        return promise;

      },
      findList: function() {

        var promise = Skill.find().exec();

        return promise;

      }
    };

  };

  return SkillDAO;

} () );