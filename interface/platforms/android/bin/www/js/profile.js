( function( $, window ) {

  "use strict";

  var $target = $( '.js-profile' ),
      $score = $target.find( '.js-score' ),
      $name = $target.find( '.js-name' ),
      $nick = $target.find( '.js-nick' ),
      $email = $target.find( '.js-email' );

  $( document.body ).ready( function () {

      var url = config.url + '/user/' + window.localStorage.getItem( 'token' );

      $.get( url )
        .done( function( data ) {

          if( data.cod === 200 ) {

            $score.html( data.user.score );
            $name.html( data.user.name );
            $nick.html( data.user.nick );
            $email.html( data.user.email );

          } else if( data.cod === 400 ) {

            console.log( data );

          }

        } );

  } );

} )( jQuery, window, undefined);