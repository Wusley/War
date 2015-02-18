( function( $, window ) {

    "use strict";

    function onDeviceReady() {
        document.addEventListener("online", onOnline, false);
        document.addEventListener("resume", onResume, false);
        loadMapsApi();
    }

    function onOnline() {
        loadMapsApi();
    }

    function onResume() {
        loadMapsApi();
    }

    function loadMapsApi() {

        if (navigator.connection.type === Connection.NONE || (window.google !== undefined && window.google.maps)) {
            return;
        }

        $.getScript('https://maps.googleapis.com/maps/api/js?signed_in=true&sensor=true&callback=onMapsApiLoaded&v=3.exp');

    }

    window.onMapsApiLoaded = function () {

      navigator.geolocation.getCurrentPosition( showMap );

      function showMap( position ) {

        // Maps API loaded and ready to be used.
        var map = new google.maps.Map( document.getElementById( "map" ), {
            zoom: 14,
            center: new google.maps.LatLng( position.coords.latitude, position.coords.longitude )
        } );

      }

    };

    document.addEventListener("deviceready", onDeviceReady, false);

  // function initialize() {

  //   navigator.geolocation.getCurrentPosition( showMap );

  //   function showMap( position ) {

  //     var mapOptions = {
  //       zoom: 14,
  //       center: new google.maps.LatLng( position.coords.latitude, position.coords.longitude )
  //     };

  //     var map = new google.maps.Map(document.getElementById( 'map' ),
  //         mapOptions);

  //   }
  // }

  // google.maps.event.addDomListener(window, 'load', initialize);

} )( jQuery, window, undefined);