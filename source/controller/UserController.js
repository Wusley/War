module.exports = function( router, mongoose, cache, uuid ) {

  // DEPENDENCIES
  var userValidator = require( '../service/userValidator' ),
      emailValidator = require( '../service/emailValidator' ),
      passwordValidator = require( '../service/passwordValidator' ),
      positionValidator = require( '../service/positionValidator' ),
      contactUser = require( '../service/contactUser' ),
      UserDao = require( '../dao/UserDAO' ),
      InterceptAccess = require( '../interceptor/interceptAccess' );

  var userDao = new UserDao( mongoose ),
      interceptAccess = new InterceptAccess( cache );

  // IMPORT
  require( '../controller/AccessController' )( router, mongoose, cache, uuid, userDao );

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
      client.errors = errors || null;
      client.nick = null;
      client.email = null;

      if( status === 'nick' ) {

        client.nick = false;

      }

      if( status === 'email' ) {

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

  router.post('/reset-password', function( req, res, next ) {

    var client = {},
        errors = passwordValidator( req );

    function success() {
      client.cod = 200;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.token = null;
      client.expired = null;

      if( status === 'token' ) {

        client.token = false;

      }

      if( status === 'expired' ) {

        client.expired = false;

      }

      res.send( client );
    }

    if( !errors ) {

      userDao.updatePassword( req.body.token, req.body.password, success, fail );

    } else {

      fail( 'errors' ,errors );

    }

  } );

  router.post('/forgot-password', function( req, res, next ) {

    var client = {},
        errors = emailValidator( req );

    function success( user ) {

      function _success() {

        client.cod = 200;

        res.send( client );

      }

      function _fail( status, errors ) {

        client.cod = 400;
        client.errors = errors || null;

        res.send( client );

      }

      var contact = new contactUser();

      contact
        .sendEmail( {
          from: 'Warrr <gpswarrr@gmail.com>',
          to: user.email,
          subject: 'Resetar senha',
          text: 'Resetar senha',
          html: 'Olá, ' + user.nick + '. Para resetar sua senha, clique no link a seguir. <a href="http://localhost/reset-password.html?token=' + user.forgotPassword.resetPasswordToken + '">Reset password</a>'
        }, _success, _fail );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.user = null;

      if( status === 'user' ) {

        client.user = false;

      }

      res.send( client );
    }

    if( !errors ) {

      userDao.updateForgotPassword( req.body.email, success, fail );

    } else {

      fail( 'errors', errors );

    }

  } );

  router.post('/position', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {},
        errors = positionValidator( req );

    function success( user ) {
      client.cod = 200;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;

      res.send( client );
    }

    if( !errors ) {

      userDao.updatePosition( nick, req.body.latitude, req.body.longitude, success, fail );

    } else {

      fail( 'errors', errors );

    }

  } );

  router.get('/position/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {},
        promise = userDao.findNick( nick );

    function success( position ) {
      client.cod = 200;
      client.position = position;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.position = null;

      if( status === 'position' ) {

        client.position = false;

      }

      res.send( client );
    }

    promise
      .then( function( user ) {

        if( user.position.latitude && user.position.longitude ) {

          success( {
            'lat': user.position.latitude,
            'lng': user.position.longitude
          } );

        } else {

          fail( 'position' );

        }

      } );

  } );

};
