var express = require('express');
var router = express.Router();
var db=require('monk')('localhost/iksoks10');
var SveIgre=db.get('AktivneIgre');
var MatricaNova1;


/* GET users listing. */
router.get('/', function(req, res, next) {
SveIgre.remove({});
  res.send("Uspješno brisanje svih soba.");
});

router.get('/:ime', function(req, res, next) { // ovo bilo koje, ovo nam ne treba xD
  res.send('Amina vidis li ovo', req.params.ime);// ovo req.params.ime-- kupi ovo :ime, a ovo :ime je regex, ? znaci da je opcionalac
});

router.post('/:brojsobe/:IgracBroj',function(req, res,next){

  SveIgre.find({},function(err,data) {
    for(var i=0;i<data.length;i++)
    { ///Ukoliko neko pritisne quit, onda ja izbrisem samo jednog igraca, ako ostane drugi unutra, ako nema nijednog, izbrisem igru
      if(data[i].Igrac2.broj==req.params.IgracBroj) {
        if(data[i].Igrac1.ime!=undefined) {
          if (data[i].BrojSobe == req.params.brojsobe && req.params.IgracBroj == data[i].Igrac2.broj) {
            MatricaNova1 = data[i].Matrica;
            for (var j = 0; j < MatricaNova1.length; j++) {
              MatricaNova1[j].zauzeto = 0;
              MatricaNova1[j].znak = "";
            }
            SveIgre.update({"BrojSobe": req.params.brojsobe}, {
              $set: {
                "Igrac2": {},
                "Matrica": MatricaNova1,
                "NaPotezu": {}
              }
            })
          }
        }
        else if(data[i].Igrac1.broj==undefined)
        {
          SveIgre.remove({"BrojSobe":req.params.brojsobe});
        }
        res.send("Odustao je od igre igrac broj 2.")
      }
      else if(data[i].Igrac1.broj==req.params.IgracBroj)
      {
        if(data[i].Igrac2.ime==undefined)
        {
          SveIgre.remove({"BrojSobe":req.params.brojsobe});
        }
        else
        {
          MatricaNova1 = data[i].Matrica;
          for (var j = 0; j < MatricaNova1.length; j++) {
            MatricaNova1[j].zauzeto = 0;
            MatricaNova1[j].znak = "";
          }
          SveIgre.update({"BrojSobe": req.params.brojsobe}, {
            $set: {
              "Igrac1": {},
              "Matrica": MatricaNova1,
              "NaPotezu": {}
            }
          })
        }
        res.send("Odustao od igre igrac broj1");
      }
    }
  });

});

module.exports = router;
