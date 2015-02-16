( function( $, window ) {

  var $target = $( '.js-form-register' ),
      $submit = $target.find( '[type="submit"]' );

      $submit.on( 'click', function() {

        var data = $target.serialize();

        $.post( 'http://localhost:3000/user', data )
          .done( function( data ) {

            console.log(data);

          } );


      } );



} )( jQuery, window, undefined);