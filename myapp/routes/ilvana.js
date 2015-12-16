var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {//ovo je bez imena ikakvog
  res.send('Amina vidis li ovo');
});

router.get('/:ime', function(req, res, next) {// ovo ime samo da oznacimo da kupi ime te rute za get
  res.send(req.params.ime + '! Danas je divan dan');
});

router.post('/:ime',function(req, res,next){ //ovo ime, moze bit bilo koje il sta
  res.send('ajsdjsahdjsadjhsahsjdbjsdhbs');
});

router.post('/n/novaruta/:opcionalno?',function(req, res,next){ //ovo ime, moze bit bilo koje il sta
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  res.send(req.body.param1);
});

module.exports = router;
