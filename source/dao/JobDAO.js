module.exports = ( function() {

  var JobDAO = function( mongoose ) {

    var schema = require( '../model/Job' ),
        jobConfig = require( '../config/job' ),
        jobSchema = mongoose.Schema( schema );

    var Job = mongoose.model( 'Job', jobSchema );

    return {
      save: function( job, success, fail ) {

        var that = this,
            findPromise = that.find( job.name );

        findPromise.then( function( jobs) {

          if( !jobs ) {

            var dao = new Job( job );

            dao.save( function ( err, job ) {

              if(err) return console.error( err );

              success( job );

            } );

          } else {

            fail( 'job' );

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

      }
    };

  };

  return JobDAO;

} () );