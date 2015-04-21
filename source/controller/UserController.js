module.exports = function( router, interceptAccess, userDao, partyDao ) {

  // DEPENDENCIEs
  var userValidator = require( '../service/userValidator' ),
      emailValidator = require( '../service/emailValidator' ),
      jobValidator = require( '../service/jobValidator' ),
      passwordValidator = require( '../service/passwordValidator' ),
      treatResponse = require( '../service/treatResponse' ),
      contactUser = require( '../service/contactUser' );

  router.get( '/user/:token', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        promise = userDao.findUser( nick );

    promise
      .then( function( user ) {

        if( user ) {

          // Handle Data
          response.success( { 'user': {
            'name': user.name,
            'nick': user.nick,
            'email': user.email,
            'score': user.score
          } } );

        } else {

          response.fail( 'empty' );

        }

      } );

  } );

  router.post( '/user', function( req, res, next ) {

    var response = treatResponse( res ),
        errors = userValidator( req );

    if( !errors ) {

      userDao.save( req.body, { 'success': function( data ) {

        var contact = new contactUser();

        contact
          .sendEmail( {
            from: 'Warrr <gpswarrr@gmail.com>',
            to: data.user.email,
            subject: 'Conta criada com sucesso',
            text: 'Bem vindo ' + data.user.nick + ' ao mundo Warrr',
            html: 'Batalhas eletrizantes o aguardam...'
          } );

        response.success( { 'user': data.user } );

      }, 'fail': response.fail } );

    } else {

      response.fail( { 'errors': errors } );

    }

  } );

  router.put( '/user/job', interceptAccess.checkConnected, function( req, res, next ) {

    var nick = req.session.nick,
        response = treatResponse( res ),
        errors = jobValidator( req );

    if( !errors ) {

      userDao.updateJob( nick, req.body.job, response );

    } else {

      response.fail( { 'errors': errors } );

    }

  } );

  router.post( '/reset-password', function( req, res, next ) {

    var response = treatResponse( res ),
        errors = passwordValidator( req );

    if( !errors ) {

      userDao.updatePassword( req.body.token, req.body.password, response );

    } else {

      response.fail( { 'errors': errors } );

    }

  } );

  router.post( '/forgot-password', function( req, res, next ) {

    var response = treatResponse( res ),
        errors = emailValidator( req );

    if( !errors ) {

      userDao.updateForgotPassword( req.body.email, function( user ) {

        var contact = new contactUser();

        contact
          .sendEmail( {
            from: 'Warrr <gpswarrr@gmail.com>',
            to: user.email,
            subject: 'Resetar senha',
            text: 'Resetar senha',
            html: 'Olá, ' + user.nick + '. Para resetar sua senha, clique no link a seguir. <a href="http://localhost/reset-password.html?token=' + user.forgotPassword.resetPasswordToken + '">Reset password</a>'
          } );

        response.success();

      }, response.fail );

    } else {

      response.fail( { 'errors': errors } );

    }

  } );

};
