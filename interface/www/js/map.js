( function( $, window ) {

  "use strict";

  function initialize( user, partners, enemies ) {

    var mapOptions = {
      zoom: 14,
      'mapTypeId': google.maps.MapTypeId.ROADMAP
    };

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

            google.maps.event.addDomListener( window, 'load', initialize( data.user, data.partners, data.enemies ) );

          } else if( data.cod === 400 ) {

            console.log( data );

          }

        } );

  } );

} )( jQuery, window, undefined);