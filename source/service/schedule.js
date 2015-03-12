module.exports = ( function() {

  var Schedule = function() {

    var cron = {},
        queue = [];

    return {
      start: function( delay, callback ) {

        cron = setInterval( ping, delay, queue, callback );

        function ping( queue, callback ) {

          var id = 0, length = queue.length;
          for( ; id < length ; id = id + 1 ) {

            callback( queue[ id ] );

          };

        }

      },
      addQueue: function( data ) {

        queue.push( data );

      },
      rmQueue: function( refer ) {

        var id = queue.indexOf( refer );

        if( id > -1 ) {

          queue.splice( id, 1 );

        }

      }
    };

  };

  return Schedule;

} () );