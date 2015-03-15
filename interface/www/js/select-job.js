( function( $, window ) {

  "use strict";

  var $target = $( '.js-form-Job' ),
      $select = $( '.js-select' ),
      $submit = $target.find( '[type="submit"]' );

  $( document.body ).ready( function () {

    var url = config.url + '/jobs';

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          var id;
          for( id in data.jobs ) {

            if( data.jobs.hasOwnProperty( id ) ) {

              $select.append( '<option value="' + data.jobs[ id ].name + '">' + data.jobs[ id ].name +  '</option>' );

            }

          }

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

      $submit
        .on( 'click', function() {

          var url = config.url + '/user/job';

          var data = $target.serialize();

          $.support.cors = true;

          $.ajax( {
            url: url,
            type: 'PUT',
            data: data,
            dataType: 'json'
          } )
          .done( function( data ) {

            console.log(data);

            if( data.cod === 200 ) {


            } else {

              // console.log( 'Falha ao conectar' );

            }

          } );

        } );

  } );

} )( jQuery, window, undefined);