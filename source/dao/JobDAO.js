module.exports = ( function() {

  var JobDAO = function( mongoose ) {

    var schema = require( '../model/Job' ),
        jobConfig = require( '../config/job' ),
        jobSchema = new mongoose.Schema( schema );

    var Job = mongoose.model( 'Job', jobSchema );

    return {
      save: function( job, response ) {

        var that = this,
            findPromise = that.find( job.name );

        findPromise.then( function( jobs ) {

          if( !jobs ) {

            var dao = new Job( job );

            dao.save( function ( err, job ) {

              if( !err ) {

                response.success( { 'job': job } );

              } else {

                response.fail( 'save' );

              }


            } );

          } else {

            response.fail( 'exist' );

          }

        } );

      },
      find: function( name ) {

        var promise = Job.findOne( { name: name } ).exec();

        return promise;

      },
      findList: function() {

        var promise = Job.find().exec();

        return promise;

      },
      updateJobSkill: function( name, skills, response ) {

        var promise = Job
                        .update( { name: name }, { 'skills': skills } ).exec();

        promise
          .then( function( result ) {

            if( result.ok > 0 ) {

              response.success( { 'skills': skills } );

            } else {

              response.fail() ;

            }

          } );

      }
    };

  };

  return JobDAO;

} () );