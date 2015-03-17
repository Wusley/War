( function( $, window ) {

  "use strict";

  var mapOptions = {
    zoom: 14,
    'mapTypeId': google.maps.MapTypeId.ROADMAP
  };

  function initialize( user, partners, enemies ) {

    var map = new google.maps.Map( document.getElementById( 'map' ), mapOptions );

    var id,
        partnersLength = partners.length,
        enemiesLength = enemies.length;

    addYou( map, user );

    id = 0;
    for( ; id < partnersLength; id = id + 1 ) {

      addPartner( map, partners[ id ] );

    }

    id = 0;
    for( ; id < enemiesLength; id = id + 1 ) {

      addEnemy( map, enemies[ id ] );

    }

  }

  function addEnemy( map, partner ) {
    return new google.maps.Marker( {
      position: new google.maps.LatLng( partner.position[ 0 ], partner.position[ 1 ] ),
      map: map,
      icon: 'images/enemy.png',
      title: 'Enemy'
    } );
  }

  function addPartner( map, partner ) {
    return new google.maps.Marker( {
      position: new google.maps.LatLng( partner.position[ 0 ], partner.position[ 1 ] ),
      map: map,
      icon: 'images/ally.png',
      title: 'Partner'
    } );
  }

  function addYou( map, partner ) {

    var pin = {
      path: 'images/pin.png',
      scale: 1
    };

    map.setCenter( new google.maps.LatLng( partner.position[ 0 ], partner.position[ 1 ] ) );

     var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng( partner.position[ 0 ], partner.position[ 1 ] ),
        'mapTypeId': google.maps.MapTypeId.ROADMAP
      };

      var rad = 500;

      // convert mi to km
      rad = rad / 0.62137;

      var draw_circle = new google.maps.Circle( {
          center: mapOptions.center,
          radius: rad,
          strokeColor: "red",
          strokeOpacity: 0.6,
          strokeWeight: 1,
          fillColor: "transparent",
          fillOpacity: 0.35,
          map: map
      } );

      var obj = {
        'id': 'lol'
      };

      draw_circle.objInfo = obj;


    var marker = new google.maps.Marker( {
      position: new google.maps.LatLng( partner.position[ 0 ], partner.position[ 1 ] ),
      map: map,
      icon: 'images/pin.png',
      title: 'You'
    } );

    var contentString = 'Teste';

    var infowindow = new google.maps.InfoWindow( {
      content: contentString
    } );

    google.maps.event.addListener( marker, 'click', function() {
      infowindow.open( map, marker );
    } );

    return marker;
  }

  $( document.body ).ready( function () {

      var url = config.url + '/position/' + window.localStorage.getItem( 'token' );

      $.get( url )
        .done( function( data ) {

          if( data.cod === 200 ) {

            google.maps.event.addDomListener( window, 'load', initialize( data.user, data.partners, data.enemies ) );

          } else if( data.cod === 400 ) {

            console.log( data );

          }

        } );

  } );

} )( jQuery, window, undefined);