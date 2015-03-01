( function( $, window ) {

  "use strict";

  var $target = $( '.js-form-connect' ),
      $submit = $target.find( '[type="submit"]' );

  function cache( token ) {

    console.log(token);

    window.localStorage.setItem( 'token', token );

  }

  $submit
    .on( 'click', function() {

      var data = $target.serialize();

      $.ajax( {
          url: 'http://localhost:3000/connect',
          type: 'POST',
          data: data,
          dataType: 'json'
        } )
        .done( function( data ) {

          if( data.cod === 200 ) {

            cache( data.token );

          } else {

            // console.log( 'Falha ao conectar' );

          }

        } );

    } );

} )( jQuery, window, undefined);