( function( $, window ) {

  "use strict";

  function initialize( nick, partners ) {

    var mapOptions = {
      zoom: 14,
      // center: new google.maps.LatLng( partners[0].position[0], partners[0].position[1] ),
      'mapTypeId': google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map( document.getElementById( 'map' ), mapOptions );

    var id = 0,
        partnersLength = partners.length;

    for( ; id < partnersLength; id = id + 1 ) {

      if( partners[ id ].nick !== nick ) {

        addPartner( map, partners[ id ] );

      } else {

        addYou( map, partners[ id ] );

      }

    }

  }

  function addPartner( map, partner ) {
    return new google.maps.Marker( {
      position: new google.maps.LatLng( partner.position[ 0 ], partner.position[ 1 ] ),
      map: map,
      title: 'Partner'
    } );
  }

  function addYou( map, partner ) {

    var pin = {
      path: 'images/pin.png',
      scale: 1
    };

    map.setCenter( new google.maps.LatLng( partner.position[ 0 ], partner.position[ 1 ] ) );

    return new google.maps.Marker( {
      position: new google.maps.LatLng( partner.position[ 0 ], partner.position[ 1 ] ),
      map: map,
      icon: 'images/pin.png',
      title: 'You'
    } );
  }

  $( document.body ).ready( function () {

      var url = config.url + '/position/' + window.localStorage.getItem( 'token' );

      $.get( url )
        .done( function( data ) {

          if( data.cod === 200 ) {

            console.log(data);

            google.maps.event.addDomListener( window, 'load', initialize( data.nick, data.partners ) );

          } else if( data.cod === 400 ) {

            console.log( data );

          }

        } );

  } );

} )( jQuery, window, undefined);