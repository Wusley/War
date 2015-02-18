var express = require( 'express' ),
    session = require( 'express-session' ),
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

app.use( session( {
    secret: 'warrr-warrr-warrr',
    name: 'worrr-worrr-worrr',
    resave: false,
    saveUninitialized: true,
} ) );

app.use( function( req, res, next ) {

    // console.log( req.session );

    // Interceptor

    next();

} );

app.use( '/', cors, routes );

// development error handler
// will print stacktrace
if( app.get( 'env' ) === 'development' ) {
    app.use(function( err, req, res, next ) {
        res.status( err.status || 500 );
        res.render( 'error', {
            message: err.message,
            error: err
        } );
    } );
}

// production error handler
// no stacktraces leaked to user
app.use( function( err, req, res, next ) {
    res.status( err.status || 500 );
    res.render( 'error', {
        message: err.message,
        error: {}
    } );
} );

module.exports = app;
