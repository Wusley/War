( function( $, window ) {

  "use strict";


  var $target = $( '.js-party' ),
      $partners = $target.find( '.js-partners' ),
      $score = $target.find( '.js-party-score' ),
      $name = $target.find( '.js-party-name' ),
      $description = $target.find( '.js-party-description' );

  $( document.body ).ready( function () {

      var url = 'http://localhost:3000/party/' + window.localStorage.getItem( 'token' );

      $.get( url )
        .done( function( data ) {

          if( data.cod === 200 ) {

            $score.html( data.party.score );
            $name.html( data.party.name );
            $description.html( data.party.description );

            var id;
            for( id in data.party.partners ) {

              if( data.party.partners.hasOwnProperty( id ) ) {

                  $( '.js-partners' ).append( '<li>' + data.party.partners[ id ] + '</li>' );

              }

            }


          } else if( data.cod === 400 ) {

            console.log( data );

          }

        } );

  } );

} )( jQuery, window, undefined);