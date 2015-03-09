( function( $, window ) {

  "use strict";

  var $target = $( '.js-form-skill' ),
      $submit = $target.find( '[type="submit"]' );

  $submit.on( 'click', function() {

    console.log('teste');
    var data = $target.serialize();


    $.post( config.url + '/skill', data )
      .done( function( data ) {

        console.log( data );

      } );

  } );

} )( jQuery, window, undefined);