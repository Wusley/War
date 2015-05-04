module.exports = ( function() {

  var JobCompose = function( jobDao, skillDao ) {

    var _ = require( 'underscore' );

    return {
      list: function( success, fail ) {

        var composerJob = jobDao.findList();

        composerJob.then( function( jobs ) {

          if( jobs ) {

            var composerSkill = skillDao.findList();

            composerSkill.then( function( skills ) {

              if( skills ) {

                injectSkill( jobs, skills );

              } else {

                fail();

              }

            } );

          } else {

            fail();

          }

        } );

        function injectSkill( jobs, skills ) {

          // console.log( skills );

          var skill = 0,
              skillsLength = skills.length,
              skillsObj = {},
              commonCollection = {};
          for( ; skill < skillsLength ; skill = skill + 1 ) {

            if( skills[ skill ].common ) {

              if( !commonCollection[ skills[ skill ].name ] ) {

                commonCollection[ skills[ skill ].name ] = [];

              }

              commonCollection[ skills[ skill ].name ].push( _.clone( skills[ skill ] ) );

            } else {

              if( !skillsObj[ skills[ skill ].name ] ) {

                skillsObj[ skills[ skill ].name ] = [];

              }

              skillsObj[ skills[ skill ].name ].push( _.clone( skills[ skill ] ) );

            }

          }

          var job = 0,
              jobsLength = jobs.length,
              jobsObj = {};
          for( ; job < jobsLength ; job = job + 1 ) {

            var skill = 0,
                skills = jobs[ job ].skills,
                skillsLength = skills.length;

                jobsObj[ jobs[ job ].name ] = _.clone( jobs[ job ].toObject() );
                jobsObj[ jobs[ job ].name ].skills = {};

            for( ; skill < skillsLength ; skill = skill + 1 ) {

              if( skillsObj[ skills[ skill ] ] !== undefined ) {

                jobsObj[ jobs[ job ].name ].skills[ skills[ skill ] ] = _.clone( skillsObj[ skills[ skill ] ] );

              }

            }

            jobsObj[ jobs[ job ].name ].skills = _.extend( jobsObj[ jobs[ job ].name ].skills, commonCollection );

          }

          success( jobsObj );

        }

      }
    };

  };

  return JobCompose;

} () );