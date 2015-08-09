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

        getTargetSimpleAttack( $( this ).attr( 'id' ), templateSimpleAttack );

      } );

      $( '.js-line' ).on( 'click', function() {

        getLine( $( this ).attr( 'id' ), templateLineAction );

      } );

      $( '.js-line-partner' ).on( 'click', function() {

        getLine( $( this ).attr( 'id' ), templateLineAction, 'partner' );

      } );

      $( '.js-line-enemy' ).on( 'click', function() {

        getLine( $( this ).attr( 'id' ), templateLineAction, 'enemy' );

      } );

    }
  };

  function templateSimpleAttack( user, target ) {
    var $modal = $( '.js-modal-simple-attack' ),

        $target = $modal.find( '.js-target' ),

        $user = $modal.find( '.js-user' ),
        $userjob = $user.find( '.js-job' ),
        $userName = $user.find( '.js-nick' ),
        $userScore = $user.find( '.js-score' ),

        $form = $modal.find( '.js-form-simple-attack' ),
        $targetJob = $target.find( '.js-job' ),
        $targetNick = $target.find( '.js-nick' ),
        $targetScore = $target.find( '.js-score' ),

        $skills = $modal.find( '.js-skills' ),

        $fieldTarget = $form.find( '[name="target"]' );

    $userName.html( user.nick );
    $userjob.html( user.job.name );
    $userScore.html( user.score);

    $targetNick.html( target.nick );
    $targetJob.html( target.job.name );
    $targetScore.html( target.score );

    $fieldTarget.val( target.nick );

    $skills.html( '' );

    var id;
    for( id in user.skillUpgrades ) {

      if( user.skillUpgrades.hasOwnProperty( id ) ) {

        $skills.append( '<li>' + user.skillUpgrades[ id ].skill + '</li>' );

      }

    }

    $( '.js-modal' ).hide();

    $modal.fadeIn( 300 );

  }

  function templateCompostAttack( user, target, action ) {

    var $modal = $( '.js-modal-compost-attack' ),

        $form = $modal.find( '.js-form-compost-attack' ),

        $user = $modal.find( '.js-user' ),
        $userjob = $user.find( '.js-job' ),
        $userName = $user.find( '.js-nick' ),
        $userScore = $user.find( '.js-score' ),

        $target = $modal.find( '.js-target' ),
        $targetJob = $target.find( '.js-job' ),
        $targetNick = $target.find( '.js-nick' ),
        $targetScore = $target.find( '.js-score' ),

        $skills = $modal.find( '.js-skills' ),

        $attackers = $modal.find( '.js-attackers' ),
        $atkList = $attackers.find( '.js-list' );

    $userName.html( user.nick );
    $userjob.html( user.job.name );
    $userScore.html( user.score);

    $targetNick.html( target.nick );
    $targetJob.html( target.job.name );
    $targetScore.html( target.score );

    $form.attr( 'id', action._id );

    $atkList.html( '' );

    var atkId = 0,
        atkLength = action.atks.length;
    for( ; atkId < atkLength ; atkId = atkId + 1 ) {

        $atkList.append( '<li>' + action.atks[ atkId ].nick + '</li>' );

    }

    $skills.html( '' );

    var id;
    for( id in user.skillUpgrades ) {

      if( user.skillUpgrades.hasOwnProperty( id ) ) {

        $skills.append( '<li>' + user.skillUpgrades[ id ].skill + '</li>' );

      }

    }

    $( '.js-modal' ).hide();

    $modal.fadeIn( 300 );

  }

  function templateCompostDefense( user, target, action ) {

    var $modal = $( '.js-modal-compost-defense' ),

        $form = $modal.find( '.js-form-compost-defense' ),

        $user = $modal.find( '.js-user' ),
        $userjob = $user.find( '.js-job' ),
        $userName = $user.find( '.js-nick' ),
        $userScore = $user.find( '.js-score' ),

        $target = $modal.find( '.js-target' ),
        $targetJob = $target.find( '.js-job' ),
        $targetNick = $target.find( '.js-nick' ),
        $targetScore = $target.find( '.js-score' ),

        $skills = $modal.find( '.js-skills' ),

        $fieldId = $form.find( '[name="id"]' ),

        $attackers = $modal.find( '.js-attackers' ),
        $atkList = $attackers.find( '.js-list' ),
        $defenders = $modal.find( '.js-defenders' ),
        $defList = $defenders.find( '.js-list' );

    $userName.html( user.nick );
    $userjob.html( user.job.name );
    $userScore.html( user.score);

    $targetNick.html( target.nick );
    $targetJob.html( target.job.name );
    $targetScore.html( target.score );

    $form.attr( 'id', action._id );

    $defList.html( '' );

    var defId = 0,
        defLength = action.defs.length;
    for( ; defId < atkLength ; defId = defId + 1 ) {

        $defList.append( '<li>' + action.defs[ defId ].nick + '</li>' );

    }

    $atkList.html( '' );

    var atkId = 0,
        atkLength = action.atks.length;
    for( ; atkId < atkLength ; atkId = atkId + 1 ) {

        $atkList.append( '<li>' + action.atks[ atkId ].nick + '</li>' );

    }

    $skills.html( '' );

    var id;
    for( id in user.skillUpgrades ) {

      if( user.skillUpgrades.hasOwnProperty( id ) ) {

        $skills.append( '<li>' + user.skillUpgrades[ id ].skill + '</li>' );

      }

    }

    $( '.js-modal' ).hide();

    $modal.fadeIn( 300 );

  }

  function templateSimpleDefense( user, action ) {

    var $modal = $( '.js-modal-simple-defense' ),

        $form = $modal.find( '.js-form-simple-defense' ),

        $user = $modal.find( '.js-user' ),
        $userjob = $user.find( '.js-job' ),
        $userName = $user.find( '.js-nick' ),
        $userScore = $user.find( '.js-score' ),

        $skills = $modal.find( '.js-skills' ),

        $fieldId = $form.find( '[name="id"]' ),

        $attackers = $modal.find( '.js-attackers' ),
        $atkList = $attackers.find( '.js-list' ),
        $defenders = $modal.find( '.js-defenders' ),
        $defList = $defenders.find( '.js-list' );

    $userName.html( user.nick );
    $userjob.html( user.job.name );
    $userScore.html( user.score);

    $form.attr( 'id', action._id );

    $defList.html( '' );

    var defId = 0,
        defLength = action.defs.length;
    for( ; defId < atkLength ; defId = defId + 1 ) {

      $defList.append( '<li>' + action.defs[ defId ].nick + '</li>' );

    }

    $atkList.html( '' );

    var atkId = 0,
        atkLength = action.atks.length;
    for( ; atkId < atkLength ; atkId = atkId + 1 ) {

      $atkList.append( '<li>' + action.atks[ atkId ].nick + '</li>' );

    }

    $skills.html( '' );

    var id;
    for( id in user.skillUpgrades ) {

      if( user.skillUpgrades.hasOwnProperty( id ) ) {

        $skills.append( '<li>' + user.skillUpgrades[ id ].skill + '</li>' );

      }

    }

    $( '.js-modal' ).hide();

    $modal.fadeIn( 300 );

  }

  function templateLineAction( line, flag ) {

    var $modal = $( '.js-modal-line-action' ),
        $attack = $modal.find( '.js-attack' ),
        $attackList = $attack.find( '.js-list' ),
        $defense = $modal.find( '.js-defense' ),
        $defenseList = $defense.find( '.js-list' ),
        btnAction = '',
        btnAtk = '<div class="btn btn-attack js-btn-attack">Attack</div>',
        btnDef = '<div class="btn btn-defense js-btn-defense">Defense</div>',
        btnAutoDef = '<div class="btn btn-simple-defense js-btn-simple-defense">Defense</div>',
        btnCounterAtk = '<div class="btn btn-counter-attack js-btn-counter-attack">Counter-Attack</div>',
        btnCancelAtk = '<div class="btn btn-cancel-attack js-btn-cancel-attack">Cancel Attack</div>',
        btnCancelDef = '<div class="btn btn-cancel-defense js-btn-cancel-defense">Cancel Defense</div>';

      $attackList.html( '' );
      $defenseList.html( '' );

      if( line.attack && line.attack.length ) {

        if( flag === 'enemy' ) {

          btnAction = btnCounterAtk;

        } else if( flag === 'partner' ) {

          btnAction = btnAtk;

        } else {

          btnAction = btnCancelAtk;

        }

        var action = line.attack;

        var actionId = 0,
            actionLength = action.length;
        for( ; actionId < actionLength ; actionId = actionId + 1 ) {

          $attackList.append( '<li class="js-item-action attack maker js-line-action" id="' + action[ actionId ]._id + '">' + action[ actionId ].title + ' - &#9757; - maker ' + btnAction + '</li>' );

        }

      }

      if( line.outAttack && line.outAttack.length ) {

        if( flag === 'enemy' ) {

          btnAction = '';

        } else if( flag === 'partner' ) {

          btnAction = btnAtk;

        } else {

          btnAction = btnCancelAtk;

        }

        var action = line.outAttack;

        var actionId = 0,
            actionLength = action.length;
        for( ; actionId < actionLength ; actionId = actionId + 1 ) {

          $attackList.append( '<li class="js-item-action attack" id="' + action[ actionId ]._id + '">' + action[ actionId ].title + ' - &#9757; ' + btnAction + '</li>' );

        }

      }

      if( line.overAttack && line.overAttack.length ) {

        if( flag === 'enemy' ) {

          btnAction = btnAtk;

        } else if( flag === 'partner' ) {

          btnAction = btnDef + ' ' + btnCounterAtk;

        } else {

          btnAction = btnAutoDef + ' ' + btnCounterAtk;

        }

        var action = line.overAttack;

        var actionId = 0,
            actionLength = action.length;
        for( ; actionId < actionLength ; actionId = actionId + 1 ) {

          if( flag === 'enemy' ) {

            for (var i = 0; i < action[ actionId ].atks.length; i++) {

              if( action[ actionId ].atks[i].nick === user.nick ) {

                btnAction = btnCancelAtk;

              }

            };

          }

          $attackList.append( '<li class="js-item-action attack" id="' + action[ actionId ]._id + '">' + action[ actionId ].title + ' - &#9759; ' + btnAction + '</li>' );

        }

      }

      if( line.outDefense && line.outDefense.length ) {

        if( flag === 'enemy' ) {

          btnAction = '';

        } else if( flag === 'partner' ) {

          btnAction = btnDef;

        } else {

          btnAction = btnCancelDef;

        }

        var action = line.outDefense;

        var actionId = 0,
            actionLength = action.length;
        for( ; actionId < actionLength ; actionId = actionId + 1 ) {

          $defenseList.append( '<li class="js-item-action defense" id="' + action[ actionId ]._id + '">' + action[ actionId ].title + ' - &#9757; ' + btnAction + '</li>' );

        }

      }

      if( line.overDefense && line.overDefense.length ) {

        if( flag === 'enemy' ) {

          btnAction = '';

        } else if( flag === 'partner' ) {

          btnAction = btnDef;

        } else {

          btnAction = btnDef;

        }

        var action = line.overDefense;

        var actionId = 0,
            actionLength = action.length;
        for( ; actionId < actionLength ; actionId = actionId + 1 ) {

          if( flag !== 'enemy' ) {

            for (var i = 0; i < action[ actionId ].defs.length; i++) {

              if( action[ actionId ].defs[i].nick === user.nick ) {

                btnAction = btnCancelDef;

              }

            };

          }

          $defenseList.append( '<li class="js-item-action defense" id="' + action[ actionId ]._id + '">' + action[ actionId ].title + ' - &#9759; ' + btnAction + '</li>' );

        }

      }

    $modal.fadeIn( 300, function() {

      $( '.js-btn-cancel-attack' ).on( 'click', function() {

        var status = confirm( 'Confirma?' );

        if( status ) {

          cancelAttack( $( this ).closest( '.js-item-action ' ).attr( 'id' ) );

        }

      } );

      $( '.js-btn-cancel-defense' ).on( 'click', function() {

        var status = confirm( 'Confirma?' );

        if( status ) {

          cancelDefense( $( this ).closest( '.js-item-action ' ).attr( 'id' ) );

        }

      } );

      $( '.js-btn-counter-attack' ).on( 'click', function() {

        getTargetCounterAttack( $( this ).closest( '.js-item-action ' ).attr( 'id' ), templateSimpleAttack );

      } );

      $( '.js-btn-attack' ).on( 'click', function() {

        getTargetCompostAttack( $( this ).closest( '.js-item-action ' ).attr( 'id' ), templateCompostAttack );

      } );

      $( '.js-btn-defense' ).on( 'click', function() {

        getTargetCompostDefense( $( this ).closest( '.js-item-action ' ).attr( 'id' ), templateCompostDefense );

      } );

      $( '.js-btn-simple-defense' ).on( 'click', function() {

        getTargetSimpleDefense( $( this ).closest( '.js-item-action ' ).attr( 'id' ), templateSimpleDefense );

      } );

    } );

    $( '.js-modal' ).hide();

    $modal.fadeIn( 300 );

  }

  function getTargetSimpleAttack( id, template ) {

    var url = config.url + '/action/enemy/' + id + '/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          template( user, data.enemy );

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  }

  function getTargetCompostAttack( actionId, template ) {

    var url = config.url + '/attack/' + actionId + '/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          template( user, data.enemy, data.action );

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  }

  function cancelAttack( actionId ) {

    $.ajax( {
      type: "DELETE",
      url: config.url + '/attack/cancel/' + actionId,
      data: { 'teste': 'teste' },
      dataType: 'json'
    } )
    .done( function( data ) {

      if( data.cod === 200 ) {

        console.log( 'Cancelado' );

      } else if( data.cod === 400 ) {

        console.log( data );

      }

    } );

  }

  function cancelDefense( actionId ) {

    $.ajax( {
      type: "DELETE",
      url: config.url + '/defense/cancel/' + actionId,
      data: { 'teste': 'teste' },
      dataType: 'json'
    } )
    .done( function( data ) {

      if( data.cod === 200 ) {

        console.log( 'Cancelado' );

      } else if( data.cod === 400 ) {

        console.log( data );

      }

    } );

  }

  function getTargetCounterAttack( actionId, template ) {

    var url = config.url + '/counter-attack/' + actionId + '/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          template( user, data.enemy );

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  }

  function getTargetCompostDefense( actionId, template ) {

    var url = config.url + '/defense/' + actionId + '/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          template( user, data.target, data.action );

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  }

  function getTargetSimpleDefense( id, template ) {

    var url = config.url + '/defense/' + id + '/' + window.localStorage.getItem( 'token' );

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          template( user, data.action );

        } else if( data.cod === 400 ) {

          console.log( data );

        }

      } );

  }

  function getLine( id, template, flag ) {

    var url;

    if( flag ) {

      url = config.url + '/action/line/' + flag + '/' + id + '/' + window.localStorage.getItem( 'token' );

    } else {

      url = config.url + '/action/line/' + window.localStorage.getItem( 'token' );

    }

    $.get( url )
      .done( function( data ) {

        if( data.cod === 200 ) {

          template( data.line, flag );

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
                        <div class="btn line js-line-enemy" id="' + enemy._id + '">Line</div>\
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

      $( '.js-line-enemy' ).on( 'click', function() {

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

    var contentString = '<div class="btn line js-line-partner" id="' + partner._id + '">Line</div>\
                        <div class="btn active js-active" id="' + partner._id + '">Active</div>';

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

      $( '.js-line-partner' ).on( 'click', function() {

        infowindow.close();

      } );

      infobox.addListeners();

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

    var contentString = '<div class="btn line js-line" id="' + user._id + '">Line</div>\
                        <div class="btn active js-active" id="' + user._id + '">Active</div>';

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

      $( '.js-line' ).on( 'click', function() {

        infowindow.close();

      } );

      infobox.addListeners();

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