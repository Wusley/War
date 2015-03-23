( function( $, window ) {

  "use strict";

  var mapOptions = {
    zoom: 14,
    maxZoom: 14,
    minZoom: 14,
    zoomControl: false,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    // draggable: false,
    keyboardShortcuts: false,
    mapMaker: false,
    mapTypeControl: false,
    noClear: false,
    overviewMapControl: false,
    panControl: false,
    rotateControl: true,
    streetViewControl: false,
    'mapTypeId': google.maps.MapTypeId.ROADMAP
  };

  var infobox = {
    addListeners: function() {

      $( '.js-attack' ).on( 'click', function() {

        console.log( 'teste ');

        attack( $( this ) );

      } );
    }
  };

  function attack( $this ) {

    var enemy = $this.attr( 'id' );

    mountAction( enemy );

  }

  function mountSelector() {

  }

  function mountAction( id ) {

    // console.log( JSON.parse( window.localStorage.getItem( 'user' ) ) );

    getTarget( id, templateAction );

  }

  function templateAction( user, target ) {

  }

  function getTarget( id, template ) {

    var url = config.url + '/action/' + id + '/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {



        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  }

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

  function addEnemy( map, enemy ) {
    var marker = new google.maps.Marker( {
      position: new google.maps.LatLng( enemy.position[ 0 ], enemy.position[ 1 ] ),
      map: map,
      icon: 'images/enemy.png',
      title: 'Enemy'
    } );

    var contentString = '<div class="btn attack js-attack" id="' + enemy.nick + '">Attack</div>\
                        <div class="btn action js-action" id="' + enemy.nick + '">Action</div>\
                        <div class="btn active js-active" id="' + enemy.nick + '">Active</div>';

    var infowindow = new google.maps.InfoWindow( {

      content: contentString

    } );

    google.maps.event.addListener( marker, 'click', function() {

      infowindow.open( map, marker );

    } );

    google.maps.event.addListener( infowindow, 'closeclick', function() {

      infowindow.close();

    } );

    google.maps.event.addListener( infowindow, 'domready', function() {

      $( '.js-attack' ).on( 'click', function() {

        infowindow.close();

      } );

      infobox.addListeners();

    } );

  }

  function addPartner( map, partner ) {
    var marker = new google.maps.Marker( {
      position: new google.maps.LatLng( partner.position[ 0 ], partner.position[ 1 ] ),
      map: map,
      icon: 'images/ally.png',
      title: 'Partner'
    } );
  }

  function addYou( map, user ) {

    var pin = {
      path: 'images/pin.png',
      scale: 1
    };

    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng( user.position[ 0 ], user.position[ 1 ] ),
      'mapTypeId': google.maps.MapTypeId.ROADMAP
    };

    map.setCenter( mapOptions.center );

    var rad = user.job.sight;

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
      position: mapOptions.center,
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
  }

  $( document.body ).ready( function () {

      var url = config.url + '/position/' + window.localStorage.getItem( 'token' );

      $.get( url )
        .done( function( data ) {

          if( data.cod === 200 ) {

            window.localStorage.setItem( 'user', JSON.stringify( data.user ) );
            google.maps.event.addDomListener( window, 'load', initialize( data.user, data.partners, data.enemies ) );

          } else if( data.cod === 400 ) {

            console.log( data );

          }

        } );

  } );

} )( jQuery, window, undefined);