module.exports = ( function() {

  var JobCompose = function( jobDao, skillDao ) {

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

          var skill = 0,
              skillsLength = skills.length,
              skillsObj = {},
              commonCollection = [];
          for( ; skill < skillsLength ; skill = skill + 1 ) {

            skillsObj[ skills[ skill ].name ] = skills[ skill ];

            if( skills[ skill ].common ) {

              commonCollection.push( skills[ skill ] );

            }

          };

          var job = 0,
              jobsLength = jobs.length,
              jobsObj = {};
          for( ; job < jobsLength ; job = job + 1 ) {

            var skill = 0,
                skills = jobs[ job ].skills,
                skillsLength = skills.length,
                skillsCollection = [];
            for( ; skill < skillsLength ; skill = skill + 1 ) {

              skillsCollection.push( skillsObj[ jobs[ job ].skills[ skill ] ] );

            };

            jobs[ job ].skills = commonCollection.concat( skillsCollection );
            jobsObj[ jobs[ job ].name ] = jobs[ job ];

          };

          success( jobsObj );

        }

      }
    };

  };

  return JobCompose;

} () );