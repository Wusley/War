module.exports = ( function() {

  var UserDAO = function( mongoose ) {

    var schema = require( '../model/Party' ),
        partyConfig = require( '../config/party' ),
        partySchema = mongoose.Schema( schema );

    var Party = mongoose.model( 'Party', partySchema );

    return {
      insertPartner: function( id, nick ) {

        var promise = Party.findOneAndUpdate( { _id: id }, { $push: { 'partners': nick } }, { safe: true, upsert: true } ).exec();

        return promise;

      },

      findAvaliableParty: function( nicks, nick ) {

        var promise = Party.findOne( { $where: 'this.partners.length < ' + partyConfig.maxPartners } ).where( { 'partners': { $in: nicks } } ).ne( 'partners', nick ).sort( { 'score': '1' } ).exec();

        return promise;

      },

      checkUserHaveParty: function( nick ) {

        var promise = Party.findOne( { 'partners': { $in: [ nick ] } } ).exec();

        return promise;

      },

      createParty: function( nick ) {

        var dao = new Party( { 'partners': [ nick ], 'score': 0 } );

        dao.save( function ( err, party ) {

          if( err ) return console.error( err );

          console.log( party );

        } );

      }

    };

  };

  return UserDAO;

} () );