( function( $, window ) {

  var $target = $( '.js-form-connect' ),
      $submit = $target.find( '[type="submit"]' );

  $submit.on( 'click', function() {

    var data = $target.serialize();

    $.post( 'http://localhost:3000/connect', data )
      .done( function( data ) {

        console.log(data);

      } );

  } );

} )( jQuery, window, undefined);