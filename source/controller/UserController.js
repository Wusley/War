module.exports = function( router, mongoose ) {

  // Dependecies
  var registerValidator = require( '../service/RegisterValidator' ),
      user = require( '../model/User' ),
      dao = require( '../dao/UserDAO' )( mongoose, user ),
      ContactUser = require( '../service/ContactUser' );

  router.post('/user', function( req, res, next ) {

    var client = {},
        errors = registerValidator( req );

    function success( user ) {

      // var contactUser = new ContactUser();

      // contactUser
      //   .send( {
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

      dao.save( req.body, success, fail );

    } else {

      fail( 'errors', errors );

    }

  } );

};
