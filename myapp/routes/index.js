var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.send('radi index ovaj')
});

/*router.get('/:ime', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send('radi index ovaj')
});*/

module.exports = router;
