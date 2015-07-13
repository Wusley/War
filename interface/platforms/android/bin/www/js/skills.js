( function( $, window ) {

  "use strict";

  var $target = $( '.js-skills' ),
      $list = $target.find( '.js-list' );

  $( document.body ).ready( function () {

    var url = config.url + '/skills/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          var id,
              template = '';
          for( id in data[ 'skills' ] ) {

            if( data[ 'skills' ].hasOwnProperty( id ) ) {

              var skill = data[ 'skills' ][ id ];

              template = '<ul>';

              var skillId = 0,
                  skillLength = skill.length;
              for( ; skillId < skillLength ; skillId = skillId + 1 ) {

                if( skill[ skillId ].upgrade ) {

                  template += '<li>lvl: ' + skill[ skillId ].lv + ' name: ' + skill[ skillId ].name + ' - atualizado</li>';

                }

                if( !skill[ skillId ].upgrading ) {

                  if( skillId === 0 && !skill[ skillId ].upgrade || skill[ skillId ].upgradeAvaliable ) {

                    template += '<li>lvl: ' + skill[ skillId ].lv + ' name: ' + skill[ skillId ].name + ' <button class="js-upgrade" id="' + skill[ skillId ]._id + '">Upgrade</button></li>';

                  }

                } else {

                  template += '<li>lvl: ' + skill[ skillId ].lv + ' name: ' + skill[ skillId ].name + ' - atualizando</li>';

                }

              }

              template += '</ul>';

              $list.append( template );

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

      function upgrade( skillId ) {

        var url = config.url + '/skills/' + skillId + '/' + window.localStorage.getItem( 'token' );

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