( function( $, window ) {

  "use strict";

  var $target = $( '.js-skills' );

  $( document.body ).ready( function () {

    var url = config.url + '/skills';

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          var id;
          for( id in data.skills ) {

            if( data.skills.hasOwnProperty( id ) ) {

              $target.append( '<li>' + data.skills[ id ].name + '</li>' );

            }

          }

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  } );

} )( jQuery, window, undefined);