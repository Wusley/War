( function( $, window ) {

  "use strict";

  function initialize( lat, lng ) {

    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng( lat, lng ),
      'mapTypeId': google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map( document.getElementById( 'map' ), mapOptions );

    var marker = new google.maps.Marker({
      position: mapOptions.center,
      map: map,
      title: 'You'
    } );

  }

  $( document.body ).ready( function () {

      var url = 'http://localhost:3000/user/' + window.localStorage.getItem( 'token' );

      $.get( url )
        .done( function( data ) {

          if( data.cod === 200 ) {

            console.log(data);

            google.maps.event.addDomListener( window, 'load', initialize( data.position.lat, data.position.lng ) );

          } else if( data.cod === 400 ) {

            console.log( data );

          }

        } );

  } );

} )( jQuery, window, undefined);