module.exports = function( router, mongoose, cache, uuid ) {

  // DEPENDENCIES
  var userValidator = require( '../service/userValidator' ),
      emailValidator = require( '../service/emailValidator' ),
      jobValidator = require( '../service/jobValidator' ),
      passwordValidator = require( '../service/passwordValidator' ),
      contactUser = require( '../service/contactUser' ),
      UserDao = require( '../dao/UserDAO' ),
      PartyDao = require( '../dao/PartyDAO' ),
      InterceptAccess = require( '../interceptor/interceptAccess' );

  var userDao = new UserDao( mongoose ),
      partyDao = new PartyDao( mongoose ),
      interceptAccess = new InterceptAccess( cache );

  // IMPORTS
  require( '../controller/AccessController' )( router, mongoose, cache, uuid, userDao );
  require( '../controller/PositionController' )( router, mongoose, cache, uuid, userDao, partyDao );
  require( '../controller/PartyController' )( router, mongoose, cache, uuid, userDao, partyDao );

  router.get('/user/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {},
        promise = userDao.findUser( nick );

    function success( user ) {
      client.cod = 200;
      client.user = user;

      res.send( client );
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

    promise
      .then( function( user ) {

        if( user ) {

          // Handle Data
          success( {
            'name': user.name,
            'nick': user.nick,
            'email': user.email,
            'score': user.score
          } );

        } else {

          fail( 'user' );

        }

      } );

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

  router.put( '/user/job', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        client = {};
        errors = jobValidator( req );

    function success( user ) {
      client.cod = 200;
      client.user = user;

      res.send( client );
    }

    function fail( status, errors ) {
      client.cod = 400;
      client.errors = errors || null;
      client.job = null;

      if( status === 'job' ) {

        client.job = false;

      }

      res.send( client );
    }

    if( !errors ) {

      userDao.updateJob( nick, req.body.job, success, fail );

    } else {

      fail( 'errors', errors );

    }

  } );

  router.post( '/reset-password', function( req, res, next ) {

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

  router.post( '/forgot-password', function( req, res, next ) {

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

};
