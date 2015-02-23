module.exports = function( router, mongoose, cache, uuid ) {

  // Dependecies
  var userValidator = require( '../service/userValidator' ),
      emailValidator = require( '../service/emailValidator' ),
      passwordValidator = require( '../service/passwordValidator' ),
      positionValidator = require( '../service/positionValidator' ),
      contactUser = require( '../service/contactUser' ),
      user = require( '../model/User' ),
      userDao = require( '../dao/UserDAO' )( mongoose, user );
      InterceptAccess = require( '../interceptor/interceptAccess' ),
      moment = require('moment');

  var interceptAccess = new InterceptAccess( cache );

  router.get('/user/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {},
        promise = userDao.findNick( nick );

    promise
      .then( function( user ) {

        if( user.position.latitude && user.position.longitude ) {

          client.cod = 200;
          client.position = {
            'lat': user.position.latitude,
            'lng': user.position.longitude
          };

        } else {

          client.cod = 400;
          client.position = false;

        }

        res.send( client );

      } );

  } );

  router.post('/position', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {},
        errors = positionValidator( req );

    function success( user ) {
      client.cod = 200;

      res.send( client );
    }

    function fail( errors ) {
      client.cod = 400;
      client.errors = errors;

      res.send( client );
    }

    if( !errors ) {

      userDao.updatePosition( nick, req.body.latitude, req.body.longitude, success, fail );

    } else {

      fail( errors );

    }

  } );

  router.post('/connect', function( req, res, next ) {

    var client = {},
        errors = emailValidator( req );

    function success( user ) {

      var data = {
        token: user.nick + ':' + uuid.v1(),
        nick: user.nick,
        expires: moment().add( 1, 'day' )
      };

      cache
        .hmset( data.token, { nick: data.nick, expires: data.expires }, function( error, session ) {

          if( !error ) {

            client.cod = 200;
            client.token = data.token;

          } else {

            client.cod = 500;

          }

          res.send( client );

        } );

    }

    function fail( errors, status ) {
      client.cod = 400;
      client.errors = errors;

      res.send( client );
    }

    if( !errors ) {

      userDao.authenticate( req.body.email, req.body.password, success, fail );

    } else {

      fail( errors );

    }


  } );

  router.get('/disconnect/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var token = req.params.token,
        client = {};

    delete req.session.nick;

    cache
      .del( 'session.' + token,
          function ( error, session ) {

            // if( !error ) {

              console.log(session);

              client.cod = 200;

            // } else {

              // client.cod = 500;

            // }

            res.send( client );

          } );

  } );

  router.post('/reset-password', function( req, res, next ) {

    var client = {},
        errors = passwordValidator( req );

    function success() {
      client.cod = 200;

      res.send( client );
    }

    function fail( errors, status ) {
      client.cod = 400;
      client.errors = errors;
      client.token = null;

      if( status === 'token') {

        client.token = false;

      }

      res.send( client );
    }

    if( !errors ) {

      userDao.updatePassword( req.body.token, req.body.password, success, fail );

    } else {

      fail( errors );

    }

  } );

  router.post('/forgot-password', function( req, res, next ) {

    var client = {},
        errors = emailValidator( req );

    function success( user ) {

      var contact = new contactUser();

      contact
        .sendEmail( {
          from: 'Warrr <gpswarrr@gmail.com>',
          to: user.email,
          subject: 'Resetar senha',
          text: 'Resetar senha',
          html: 'Olá, ' + user.nick + '. Para resetar sua senha, clique no link a seguir. <a href="http://localhost:8000/reset-password.html?token=' + user.forgotPassword.resetPasswordToken + '">Reset password</a>'
        } );

      client.cod = 200;

      res.send( client );
    }

    function fail( errors ) {
      client.cod = 400;
      client.errors = errors;

      res.send( client );
    }

    if( !errors ) {

      userDao.updateForgotPassword( req.body.email, success, fail );

    } else {

      fail( errors );

    }

  } );

  router.post('/user', function( req, res, next ) {

    var client = {},
        errors = userValidator( req );

    function success( user ) {

      var contact = new contactUser();

      contact
        .sendEmail( {
          from: 'Warrr <gpswarrr@gmail.com>',
          to: user.email,
          subject: 'Conta criada com sucesso',
          text: 'Bem vindo ' + user.nick + ' ao mundo Warrr',
          html: 'Batalhas eletrizantes te aguardam...'
        } );

      client.cod = 200;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = null;
      client.nick = null;
      client.email = null;

      if( status === 'errors') {

        client.errors = errors;

      }

      if( status === 'nick') {

        client.nick = false;

      }

      if( status === 'email') {

        client.email = false;

      }

      res.send( client );
    }

    if( !errors ) {

      userDao.save( req.body, success, fail );

    } else {

      fail( 'errors', errors );

    }

  } );

};
