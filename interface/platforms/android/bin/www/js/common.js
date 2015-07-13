( function( $, window ) {

  "use strict";

  $.ajaxSetup( {
    beforeSend: function( jqXHR, Obj ) {

      if( Obj ) {

        Obj.data = Obj.data + window.encodeURI( '&token=' + window.localStorage.getItem( 'token' ) );

      }

    }
  } );

} )( jQuery, window, undefined);