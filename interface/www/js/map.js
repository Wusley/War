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

        action( 'new attack', $( this ) );

      } );

      $( '.js-line' ).on( 'click', function() {

        line( $( this ) );

      } );

    }
  };

  function action( type, $this ) {

    var enemyId = $this.attr( 'id' );

    mountAction( type, enemyId );

  }

  function line( $this ) {

    var targetId = $this.attr( 'id' );

    getLine( targetId, templateLineAction );

  }

  function mountAction( type, enemyId ) {

    // console.log( JSON.parse( window.localStorage.getItem( 'user' ) ) );

    var template;

    switch( type ) {

      case 'new attack': template = templateSimpleAttack;
      break;

      default: template = templateSimpleAttack;
      break;

    }

    getTarget( enemyId, template );

  }

  function templateSimpleAttack( user, target ) {
    var $modal = $( '.js-modal-simple-attack' ),

        $user = $modal.find( '.js-user' ),
        $target = $modal.find( '.js-target' ),
        $form = $modal.find( '.js-form-simple-attack' ),

        $userjob = $user.find( '.js-job' ),
        $userName = $user.find( '.js-nick' ),
        $userScore = $user.find( '.js-score' ),

        $targetJob = $target.find( '.js-job' ),
        $targetNick = $target.find( '.js-nick' ),
        $targetScore = $target.find( '.js-score' ),
        $formTargetNick = $form.find( '.js-form-target-nick' ),

        $skills = $modal.find( '.js-skills' ),

        $form = $modal.find( '.js-form-simple-attack' ),
        $name = $form.find( '[name="name"]' ),
        $souls = $form.find( '[name="souls"]' );

    $userName.html( user.nick );
    $userjob.html( user.job.name );
    $userScore.html( user.score);

    $targetNick.html( target.nick );
    $targetJob.html( target.job.name );
    $targetScore.html( target.score );
    $formTargetNick.val( target.nick );

    $souls.attr( { 'max': user.souls } );

    $skills.html( '' );

    var id;
    for( id in user.job.skills ) {

      if( user.job.skills.hasOwnProperty( id ) ) {

        $skills.append( '<li>' + user.job.skills[ id ].name + '</li>' );

      }

    }

    $modal.fadeIn( 300 );

  }

  function templateLineAction( line ) {
    var $modal = $( '.js-modal-line-action' );

    $modal.fadeIn( 300 );
  }

  function templateCompostAttack( user, target ) {

  }

  function templateCompostDefense( user, target ) {

  }

  function getTarget( id, template ) {

    var url = config.url + '/action/enemy/' + id + '/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          template( data.user, data.enemy )

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  }

  function getLine( id, template ) {

    var url = config.url + '/action/enemy/line/' + id + '/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          template( data.line );

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

    var contentString = '<div class="btn attack js-attack" id="' + enemy._id + '">Attack</div>\
                        <div class="btn line js-line" id="' + enemy._id + '">Line</div>\
                        <div class="btn active js-active" id="' + enemy._id + '">Active</div>';

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