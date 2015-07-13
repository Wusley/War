( function( $, window ) {

  "use strict";

  var $target = $( '.js-party' ),
      $partners = $target.find( '.js-partners' ),
      $score = $target.find( '.js-score' ),
      $name = $target.find( '.js-name' ),
      $description = $target.find( '.js-description' );

  $( document.body ).ready( function () {

      var url = config.url + '/party/' + window.localStorage.getItem( 'token' );

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