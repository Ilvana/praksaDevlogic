var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Amina vidis li ovo');
  console.log(req.app.amina);
  console.log(req.app.mojabaza);
});

router.get('/:ime', function(req, res, next) { // ovo bilo koje, ovo nam ne treba xD
  res.send('Amina vidis li ovo', req.params.ime);// ovo req.params.ime-- kupi ovo :ime, a ovo :ime je regex, ? znaci da je opcionalac
});

router.post('/:ime', function(req, res, next) {
  res.send('POST RADIIIII');
});


module.exports = router;
