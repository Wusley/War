( function( $, window ) {

  "use strict";


  var $score = $( '#score' ),
      $name = $( '#name' ),
      $nick = $( '#nick' ),
      $email = $( '#email' );

  $( document.body ).ready( function () {

      var url = 'http://localhost:3000/user/' + window.localStorage.getItem( 'token' );

      $.get( url )
        .done( function( data ) {

          if( data.cod === 200 ) {

            $score.val( data.user.score );
            $name.val( data.user.name );
            $nick.val( data.user.nick );
            $email.val( data.user.email );

          } else if( data.cod === 400 ) {

            console.log( data );

          }

        } );

  } );

  var $target = $( '.js-form-settigns' ),
      $submit = $target.find( '[type="submit"]' );

  $submit.on( 'click', function() {

    console.log( 'teste' );

    var data = $target.serialize();

    $.put( 'http://localhost:3000/user', data )
      .done( function( data ) {

        console.log( data );

      } );

  } );

} )( jQuery, window, undefined);