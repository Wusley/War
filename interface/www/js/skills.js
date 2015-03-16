( function( $, window ) {

  "use strict";

  var $target = $( '.js-skills' );

  $( document.body ).ready( function () {

    var url = config.url + '/skills/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          var id;
          for( id in data.skills ) {

            console.log(data.skills);

            if( data.skills.hasOwnProperty( id ) ) {

              $target.append( '<li>' + data.skills[ id ].name + ' <button class="js-upgrade" id="' + data.skills[ id ].name + '">Upgrade</button></li>' );

            }

          }

          $target
            .find( '.js-upgrade' )
              .on( 'click', function() {

                var status = confirm( 'Confirma?' );

                if( status ) {

                  upgrade( $( this ).attr( 'id' ) );

                }

              } );

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

      function upgrade( skillName ) {

        var url = config.url + '/skills/' + skillName + '/' + window.localStorage.getItem( 'token' );

        $.get( url )
          .done( function( data ) {

            if( data.cod === 200 ) {

              console.log( data );

            } else if( data.cod === 400 ) {

              console.log( data );

            }

          } );

      }

  } );

} )( jQuery, window, undefined);