( function( $, window ) {

  "use strict";

  var $target = $( '.js-form-job' ),
      $submit = $target.find( '[type="submit"]' );

  $submit.on( 'click', function() {

    var data = $target.serialize();

    $.post( config.url + '/job', data )
      .done( function( data ) {

        console.log( data );

      } );

  } );

} )( jQuery, window, undefined);