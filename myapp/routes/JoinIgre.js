var express = require('express');
var router = express.Router();
var db=require('monk')('localhost/iksoks10');
var SveIgre=db.get('AktivneIgre');
var MatricaNova1;

router.get('/', function(req, res, next) {
  res.send('');
});

router.post('/', function(req, res, next) { //vraca jason koji sadrži igre

  var data1=[];
  SveIgre.find({},function(err,data) {
    console.log('err:', err);
    for(var i=0;i<data.length;i++)
    data1.push(data[i].BrojSobe);
    console.log('data', data1);
    res.send(data1);
  });

});

router.post('/PromjenaStanja', function(req, res, next) { //

  var data1=[];
  SveIgre.find({},function(err,data) {
     for(var i=0;i<data.length;i++)
    {

    }
  });

});

router.post('/:ime/:brojigre', function(req, res, next) { //join igri odredjenoj
  SveIgre.find({},function(err,data) {
    for(var i=0;i<data.length;i++) {
      if (data[i].BrojSobe == req.params.brojigre) {

        res.send(data[i].Igrac1.ime);
        req.app.Igrac.ime = req.params.ime; //inicijalizacija igraca 2
        req.app.Igrac.znak = "O";
        req.app.Igrac.broj = req.app.NizBrojevaIgraca[req.app.brojac];
        req.app.brojac++;
        req.app.Igrac.score = 0;
        req.app.Igrac.vrijemepoteza = new Date(); //Ovo zezaaaa ako se 0 stavi


        SveIgre.find({"BrojSobe": req.params.brojigre});

        SveIgre.update({"BrojSobe": req.params.brojigre, "Igrac2": {}}, { //igrac koji se join, je igrac broj2
          $set: {
            "Igrac2": req.app.Igrac,
            "Matrica": data[i].Matrica,
            "NaPotezu": req.app.Igrac
          }
        });

        SveIgre.update({"BrojSobe": req.params.brojigre, "Igrac1": {}}, { //igrac koji se join je igrac broj1
          $set: {
            "Igrac1": req.app.Igrac,
            "Matrica": data[i].Matrica,
            "NaPotezu": req.app.Igrac
          }
        });
        //res.send("Uspješno ste se prikljuèili igri.");
      }
    }
  });
});
module.exports = router;
