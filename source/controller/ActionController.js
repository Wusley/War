module.exports = function( router, interceptAccess, schedule, actionDao, userDao, partyDao ) {

  // DEPENDENCIEs
  var handleNewAttack = require( '../service/handleNewAttack' ),
      attackValidator = require( '../service/attackValidator' ),
      castTime = require( '../service/castTime' ),
      moment = require( 'moment' );

  router.post( '/attack', interceptAccess.checkConnected, function( req, res, next ) {
    var nick = req.session.nick,
        client = {};
        errors = attackValidator( req );

    function success( user, target, title, souls, skills ) {

      var action = {
        'title': title,
        'distance': target.dis, // meters
        'date': moment(), // date
        'schedule': moment().add( castTime( target.dis ), 'minutes' ), // schedule
        'attack': {
          'nick': user.nick,
          'position': user.position
        },
        'target': { // target
          'nick': target.obj.nick,
          'position': target.obj.position
        },
        'atks': [ { 'nick': user.nick, 'skills': skills } ] // list attackers
      };

      function _success( attack ) {

        console.log( attack );

        // schedule
        //   .add( {
        //     // 'id': 'attack-' + upgrading.lv + '-' + user._id,
        //     'schedule': action.schedule,
        //     'callback': function() {

        //       console.log( 'BOOOOOOOM' );

        //       // var promiseUserUpgrade = userDao.updateSkillUpgrade( nick, upgrading );

        //       // promiseUserUpgrade
        //       //   .then( function( user ) {

        //       //     if( user ) {

        //       //       console.log( user );

        //       //     }

        //       //   } );

        //     }
        //   } );

        res.send( client );

      }

      function _fail() {

      }

      var promiseAction = actionDao.saveAttack( action, _success, _fail );

    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.user = null;
      client.enemy = null;

      if( status === 'user' ) {

        client.user = false;

      }

      if( status === 'enemy' ) {

        client.enemy = false;

      }

      res.send( client );
    }

    if( !errors ) {

      handleNewAttack( nick, req.body, userDao, partyDao, success, fail );

    } else {

      fail( 'errors', errors );

    }

    // subtrai dados do db com client, resultado volta pro db. dados client armazena em forma de ataque no doc action

  } );

  router.put( '/attack/:id', interceptAccess.checkConnected, function( req, res, next ) {
    var nick = req.session.nick,
        client = {};

    function success( user, enemy ) {
      client.cod = 200;
      client.user = user;
      client.enemy = enemy;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.user = null;
      client.enemy = null;

      if( status === 'user' ) {

        client.user = false;

      }

      if( status === 'enemy' ) {

        client.enemy = false;

      }

      res.send( client );
    }

    singleAttackValidator( nick, target, success, fail );

    // pega dados do db
    // subtrai dados do db com client, resultado volta pro db. dados client armazena em forma de ataque no doc action

  } );

  router.get( '/action/enemy/:id/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        id = req.params.id,
        client = {},
        promiseUser = userDao.findUser( nick );
        promiseEnemy = userDao.findId( id );

    function success( user, enemy ) {
      client.cod = 200;
      client.user = user;
      client.enemy = enemy;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.user = null;
      client.enemy = null;

      if( status === 'user' ) {

        client.user = false;

      }

      if( status === 'enemy' ) {

        client.enemy = false;

      }

      res.send( client );
    }

    promiseUser
      .then( function( user ) {

        if( user ) {

          promiseEnemy
            .then( function( enemy ) {

              if( enemy ) {

                // Handle Data
                success( user, enemy );

              } else {

                fail( 'enemy' );

              }

            } );

        } else {

          fail( 'user' );

        }

      } );

  } );

  router.post( '/attack/:token', interceptAccess.checkConnected, function( req, res, next ) {



  } );

  router.post( '/defense/:token', interceptAccess.checkConnected, function( req, res, next ) {



  } );

  router.get( '/active/:token', function( req, res, next ) {

    //

  } );

};
