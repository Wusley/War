
  // Config routes
  var express = require( 'express' ),
      mongoose = require( 'mongoose' ),
      uuid = require( 'node-uuid' ),
      router = express.Router();

  mongoose.connect( 'mongodb://nodejitsu:094f15dc574844069237d968fef6fb64@troup.mongohq.com:10077/nodejitsudb4669245437' );

  var redisConfig = {
    host : 'redis-1thwess-3355983076.redis.irstack.com',
    port : 6379,
    pass: 'redis-1thwess-3355983076.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4'
  };

var redis = require('redis').createClient( redisConfig.port, redisConfig.host, { auth_pass: redisConfig.pass } ),
    cache = require('express-redis-cache')( { client: redis } );

  require( './controller/UserController' )( router, mongoose, cache, uuid );

  module.exports = router;
