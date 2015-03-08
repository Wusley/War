( function( $, window ) {

  "use strict";

  var $target = $( '.js-jobs' );

  $( document.body ).ready( function () {

      var url = config.url + '/jobs';

      $.get( url )
        .done( function( data ) {

          if( data.cod === 200 ) {

            var id;
            for( id in data.jobs ) {

              if( data.jobs.hasOwnProperty( id ) ) {

                $target.append( '<li>' + data.jobs[ id ].name + ' - ' + data.jobs[ id ].description + '</li>' );

              }

            }


          } else if( data.cod === 400 ) {

            console.log( data );

          }

        } );

  } );

} )( jQuery, window, undefined);