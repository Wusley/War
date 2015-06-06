module.exports = ( function() {

  var SkillDAO = function( mongoose ) {

    var schema = require( '../model/Skill' ),
        skillSchema = mongoose.Schema( schema );

    var Skill = mongoose.model( 'Skill', skillSchema );

    return {
      save: function( skill, response ) {

        var that = this,
            findPromise = that.find( skill.name );

        findPromise.then( function( skills ) {

          if( !skills ) {

            var dao = new Skill( skill );

            dao.save( function ( err, skill ) {

              if( !err ) {

                response.success( { 'skill': skill } );

              } else {

                response.fail( 'server' );

              }

            } );

          } else {

            response.fail( 'skill' );

          }

        } );

      },
      find: function( name ) {

        var promise = Skill.findOne( { name: name } ).lean().exec();

        return promise;

      },
      findId: function( id ) {

        var promise = Skill.findOne( { _id: id } ).lean().exec();

        return promise;

      },
      findList: function() {

        var promise = Skill.find().lean().exec();

        return promise;

      }
    };

  };

  return SkillDAO;

} () );