( function( $, window ) {

  "use strict";

  var $modal = $( '.js-modal' ),
      $close = $modal.find( '.js-close' );

  $( document.body ).ready( function () {

      $close.on( 'click', function() {

        $modal.fadeOut( 300 );

      } );

  } );

} )( jQuery, window, undefined);