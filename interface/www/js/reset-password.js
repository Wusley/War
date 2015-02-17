( function( $, window ) {

  var $target = $( '.js-form-reset-password' ),
      $submit = $target.find( '[type="submit"]' );

  ( function useHash() {

    $( '.js-form-reset-password' ).find( '#token' ).val( window.location.search.slice( 7 ) );

  } () );

  $submit.on( 'click', function() {

    var data = $target.serialize();

    $.post( 'http://localhost:3000/reset-password', data )
      .done( function( data ) {

        console.log(data);

      } );

  } );

} )( jQuery, window, undefined);