module.exports = function( router, mongoose ) {

  // Dependecies
  var userValidator = require( '../service/userValidator' ),
      emailValidator = require( '../service/emailValidator' ),
      passwordValidator = require( '../service/passwordValidator' ),
      contactUser = require( '../service/contactUser' ),
      user = require( '../model/User' ),
      userDao = require( '../dao/UserDAO' )( mongoose, user );

  router.post('/connect', function( req, res, next ) {

    var client = {},
        errors = emailValidator( req );

    function success( user ) {
      client.cod = 200;

      res.send( client );
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

        client.token = true;

      }

      res.send( client );
    }

    if( !errors ) {

      userDao.updatePassword( req.body.password, req.body.token, success, fail );

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

      // var contact = new contactUser();

      // contact
      //   .sendEmail( {
      //     from: 'Warrr <gpswarrr@gmail.com>',
      //     to: user.email,
      //     subject: 'Conta criada com sucesso',
      //     text: 'Bem vindo ' + user.nick + ' ao mundo Warrr',
      //     html: 'Batalhas eletrizantes te aguardam...'
      //   } );

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

        client.nick = true;

      }

      if( status === 'email') {

        client.email = true;

      }

      res.send( client );
    }

    if( !errors ) {

      userDao.save( req.body.email, success, fail );

    } else {

      fail( 'errors', errors );

    }

  } );

};
