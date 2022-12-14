module.exports = ( function() {

  var PartyDAO = function( mongoose ) {

    var schema = require( '../model/Party' ),
        partyConfig = require( '../config/party' ),
        partySchema = mongoose.Schema( schema );

    var Party = mongoose.model( 'Party', partySchema );

    return {
      createParty: function( nick, response ) {

        var dao = new Party( { 'name': nick + '\' party master', 'partners': [ nick ] } );

        dao.save( function ( err, party ) {

          if( !err ) {

            response.success( { 'party': party } );

          } else {

            response.fail( { 'error': { 'server': false } } );

          }

        } );

      },

      insertPartner: function( id, nick ) {

        var promise = Party.findOneAndUpdate( { _id: id }, { $push: { 'partners': nick } }, { safe: true, upsert: true } ).exec();

        return promise;

      },

      findAvaliableParty: function( nicks, nick ) {

        var promise = Party.findOne( { $where: 'this.partners.length < ' + partyConfig.maxPartners } ).where( { 'partners': { $in: nicks } } ).ne( 'partners', nick ).sort( { 'score': 1 } ).exec();

        return promise;

      },

      findPartyUser: function( nick ) {

        var promise = Party.findOne( { 'partners': { $in: [ nick ] } } ).exec();

        return promise;

      },

      findTargetInParty: function( nick, target ) {

        var promise = Party.find().and( [ { 'partners': { $in: [ nick ] } }, { 'partners': { $in: [ target ] } } ] ).exec();

        return promise;

      }

    };

  };

  return PartyDAO;

} () );