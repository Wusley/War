var user = {},
    config = {
      url: 'http://localhost:3000'
    };

function getUser() {

  var url = config.url + '/user/' + window.localStorage.getItem( 'token' );

  $.get( url )
    .done( function( data ) {

      if( data.cod === 200 ) {

        user = data.user;

      } else if( data.cod === 400 ) {

        console.log( data );

      }

    } );

}

getUser();