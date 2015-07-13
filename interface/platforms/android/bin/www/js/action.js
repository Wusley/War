// simple-attack
( function( $, window ) {

  "use strict";

  var $target = $( '.js-form-simple-attack' ),
      $submit = $target.find( '[type="submit"]' );

  $submit.on( 'click', function() {

    var data = $target.serialize();

    $.post( config.url + '/attack', data )
      .done( function( data ) {

        if( data.cod === 200 ) {

          console.log( data );

        } else {

          console.log( data );

        }

      } );

  } );

} )( jQuery, window, undefined);

// compost-attack
( function( $, window ) {

  "use strict";

  var $target = $( '.js-form-compost-attack' ),
      $submit = $target.find( '[type="submit"]' );

  $submit.on( 'click', function() {

    var data = $( this ).closest( 'form' ).serialize();

    $.post( config.url + '/attack/' + $target.attr( 'id' ), data )
      .done( function( data ) {

        if( data.cod === 200 ) {

          console.log( data );

        } else {

          console.log( data );

        }

      } );

  } );

} )( jQuery, window, undefined);

// compost-defense
( function( $, window ) {

  "use strict";

  var $targetCompost = $( '.js-form-compost-defense' ),
      $submitCompost = $targetCompost.find( '[type="submit"]' );

  var $targetSimple = $( '.js-form-simple-defense' ),
      $submitSimple = $targetSimple.find( '[type="submit"]' );

  $submitCompost.on( 'click', function() {

    submit( $( this ) );

  } );

  $submitSimple.on( 'click', function() {

    submit( $( this ) );

  } );

  function submit( $this ) {

    var $form = $this.closest( 'form' );

    var data = $form.serialize();

    $.post( config.url + '/defense/' + $form.attr( 'id' ), data )
      .done( function( data ) {

        if( data.cod === 200 ) {

          console.log( data );

        } else {

          console.log( data );

        }

      } );

  }

} )( jQuery, window, undefined);