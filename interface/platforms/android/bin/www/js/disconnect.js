( function( $, window ) {

  "use strict";

  var $target = $( '.js-logout' );

  function uncache() {

    window.localStorage.clear();

  }

  $target
    .on( 'click', function() {

      var url = config.url + '/disconnect/' + window.localStorage.getItem( 'token' );

      $.get( url )
        .done( function( data ) {

          if( data.cod === 200 ) {

            uncache();

          } else if( data.cod === 400 ) {

            // console.log( 'Falha ao conectar' );

          }

        } );

    } );

} )( jQuery, window, undefined);