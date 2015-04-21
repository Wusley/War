module.exports = function( User ) {

  var moment = require( 'moment' ),
      castUserUpgrade = require( '../service/castUserUpgrade' ),
      _ = require( 'underscore' );

  var treatSouls = function( users, response ) {

    var type = users.constructor.name;

    if( type === 'Array' && users.length > 0 ) {

      var id = 0,
          usersLength = users.length;
      for( ; id < usersLength; id = id + 1 ) {

        var now = moment(),
            times = now.diff( users[ id ].updated, 'hours' );

        if( times > 0 ) {

          users[ id ] = _.extend( users[ id ], castUserUpgrade( times, users[ id ].heroes, users[ id ].souls ) );

          var promiseUser = User.update( { _id: users._id }, { updated: now.startOf( 'hour' ), heroes: users[ id ].heroes, souls: users[ id ].souls } ).exec();

          promiseUser
            .then( function( result ) {

              if( result.ok > 0 ) {

                // console.log( users );

              } else {

                response.fail();

              }

            } );

        }

      }

    } else if( type === 'Object'  ) {

      var now = moment(),
          times = now.diff( users.updated, 'hours' );

      if( times > 0 ) {

        users = _.extend( users, castUserUpgrade( times, users.heroes, users.souls ) );

        var promiseUser = User.update( { _id: users._id }, { updated: now.startOf( 'hour' ), heroes: users.heroes, souls: users.souls } ).exec();

        promiseUser
          .then( function( result ) {

            if( result.ok > 0 ) {

              // console.log( users );

            } else {

              response.fail();

            }

          } );

      }

    }

    response.success( { 'users': users } );

  }

  return treatSouls;

};