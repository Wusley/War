( function( $, window ) {

  "use strict";

  // function onDeviceReady() {
  //     document.addEventListener("online", onOnline, false);
  //     document.addEventListener("resume", onResume, false);
  //     loadMapsApi();
  // }

  // function onOnline() {
  //     loadMapsApi();
  // }

  // function onResume() {
  //     loadMapsApi();
  // }

  // function loadMapsApi() {

  //     if (navigator.connection.type === Connection.NONE || (window.google !== undefined && window.google.maps)) {
  //         return;
  //     }

  //     $.getScript('https://maps.googleapis.com/maps/api/js?signed_in=true&sensor=true&callback=onMapsApiLoaded&v=3.exp');

  // }

  // window.onMapsApiLoaded = function () {

  //   navigator.geolocation.getCurrentPosition( showMap );

  //   function showMap( position ) {

  //     var mapOptions = {
  //           zoom: 15,
  //           center: new google.maps.LatLng( position.coords.latitude, position.coords.longitude )
  //         };

  //     var map = new google.maps.Map(document.getElementById( 'map' ), mapOptions);


  //       var rad = 1000;

  //       // rad *= 1600;

  //       draw_circle = new google.maps.Circle({
  //           center: mapOptions.center,
  //           radius: rad,
  //           strokeColor: "#FF0000",
  //           strokeOpacity: 0.8,
  //           strokeWeight: 2,
  //           fillColor: "#FF0000",
  //           fillOpacity: 0.35,
  //           map: map
  //       });

  //   }

  // };

  // document.addEventListener("deviceready", onDeviceReady, false);

  function initialize( settings ) {

    navigator.geolocation.getCurrentPosition( showMap );

    function showMap( position ) {

      var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng( position.coords.latitude, position.coords.longitude ),
        'mapTypeId': google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map( document.getElementById( 'map' ), mapOptions );

      var draw_circle = new google.maps.Circle( {
            center: mapOptions.center,
            radius: settings[ 'limit-position' ],
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: map
          } ),

          obj = { 'id': 'lol' };

      draw_circle.objInfo = obj;

      google.maps.event.addListener( draw_circle, 'click', function( event ) {

        var data = {
            'latitude': parseFloat( event.latLng.G ),
            'longitude': parseFloat( event.latLng.K )
          };

        $.post( config.url + '/position', data )
          .done( function( data ) {

            console.log( data );

          } );

      } );

    }

  }

  $( document.body ).ready( function () {

    var url = config.url + '/map/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          google.maps.event.addDomListener( window, 'load', initialize( data.map ) );

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  } );

} )( jQuery, window, undefined);