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

              var $form = '<form action="javascript:void( 0 )" class="js-form-jobs" method="POST">\
                            <fieldset>\
                              <legend>' + data.jobs[ id ].name + '</legend>\
                              <input type="submit" value="Salvar">\
                              <input type="hidden" name="name" value="' + data.jobs[ id ].name + '">\
                              <textarea name="skills" cols="50" rows="5">' + data.jobs[ id ].skills.join( ', ') + '</textarea>\
                            </fieldset>\
                          </form>';

              $target.append( $form );

            }

          }

          var $jobs = $( '.js-form-jobs' ),
              $submit = $jobs.find( '[type="submit"]' );

          $submit
            .on( 'click', function() {

              var url = config.url + '/job/skills';

              var $form = $( this ).closest( $jobs  );

              var data = $form.serialize();

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

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  } );

} )( jQuery, window, undefined);