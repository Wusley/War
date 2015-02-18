( function( $, window ) {

  "use strict";

  var $target = $( '.js-form-forgot-password' ),
      $submit = $target.find( '[type="submit"]' );

  $submit.on( 'click', function() {

    var data = $target.serialize();

    $.post( 'http://localhost:3000/forgot-password', data )
      .done( function( data ) {

        console.log(data);

      } );

  } );

} )( jQuery, window, undefined);