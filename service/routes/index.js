var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function( req, res, next ) {
  // res.render('index', { title: 'Express' });

} );

router.post('/amiguinhos', function( req, res, next ) {
  // res.render('index', { title: 'Express' });

  console.log('amin');

} );

module.exports = router;
