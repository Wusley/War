( function( $, window ) {

  "use strict";

  var $target = $( '.js-form-simple-attack' ),
      $submit = $target.find( '[type="submit"]' );

  $submit.on( 'click', function() {

    console.log( 'teste' );

    var data = $target.serialize();

    $.post( config.url + '/attack', data )
      .done( function( data ) {

        if( data.cod === 200 ) {

          console.log( 'success' );

        } else {

          console.log( 'error' );

        }

      } );

  } );

} )( jQuery, window, undefined);