( function( $, window ) {

  "use strict";

  var $target = $( '.js-form-simple-attack' ),
      $submit = $target.find( '[type="submit"]' );

  $submit.on( 'click', function() {

    var data = $target.serialize();

    $.post( config.url + '/attack', data )
      .done( function( data ) {

        if( data.cod === 200 ) {

          console.log( data );

        } else {

          console.log( data );

        }

      } );

  } );

} )( jQuery, window, undefined);