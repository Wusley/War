module.exports = function( router, interceptAccess, schedule, skillDao ) {

  // DEPENDENCIEs

  router.post( '/attack', interceptAccess.checkConnected, function( req, res, next ) {
    var nick = req.session.nick,
        client = {};
        //valida dados atacado e atacante

    // pega dados do db
    // subtrai dados do db com client, resultado volta pro db. dados client armazena em forma de ataque no doc action

  } );

  router.put( '/attack/:id', interceptAccess.checkConnected, function( req, res, next ) {
    var nick = req.session.nick,
        client = {};
        //valida dados atacado e atacante

    // pega dados do db
    // subtrai dados do db com client, resultado volta pro db. dados client armazena em forma de ataque no doc action

  } );


  router.post( '/attack/:token', interceptAccess.checkConnected, function( req, res, next ) {



  } );

  router.post( '/defense/:token', interceptAccess.checkConnected, function( req, res, next ) {



  } );

  router.get( '/active/:token', function( req, res, next ) {

    //

  } );

};
