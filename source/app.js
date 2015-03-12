var express = require( 'express' ),
    path = require( 'path'),
    logger = require( 'morgan' ),
    cookieParser = require( 'cookie-parser' ),
    bodyParser = require( 'body-parser' ),
    expressValidator = require( 'express-validator' ),
    cors = require( './utils/Cors' ),
    routes = require( './routes' ),
    app = express();

app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( expressValidator() );
app.use( cookieParser() );

app.use( '/', cors, routes );

module.exports = app;