var express = require('express');
var router = express.Router();
var db=require('monk')('localhost/iksoks10');
var SveIgre=db.get('AktivneIgre');
var MatricaIgre=[];
var MatricaNova;
var BrhorizontalnoX=0;
var BrhorizontalnoO=0;
var BrvertikalnoX=0;
var  BrvertikalnoO=0;
var BrDijagonala1X=0;
var BrDijagonala1O=0;
var Score;
var MatricaRe;
var Igrac1_1;
var Igrac2_2;
var TrenutnoVrijeme;
var MatricaNova1;


router.get('/IspisiSveIgre', function(req, res, next) {

    SveIgre.find({},function(err,data) { //ispise sve igre i igrace i matricu
      res.send(data);

  });
});

setInterval(function(){
 console.log("RADIMMMMMM");
 TrenutnoVrijeme=new Date();
 SveIgre.find({},function(err,data) {  //PROVJERI SVAKO DVIJE SEKUNDE DA LI JE IGRAO, AKO NIJE IZBACI GA
     for (var i = 0; i < data.length; i++) {

         if (data[i].Igrac1.ime != undefined && data[i].Igrac2.ime != undefined && data[i].NaPotezu.ime != undefined) { // samo ako su oba tu da ovo provjeri, jer ako nisu da ne radi nista

             var minute1 = TrenutnoVrijeme.getMinutes();
             var minute2 = data[i].NaPotezu.vrijemepoteza.getMinutes();
             var rez = minute1 - minute2;

             if ((rez) > 2) {
                 if (data[i].NaPotezu.broj == data[i].Igrac2.broj) {//izbaci igraca2
                     MatricaNova1 = data[i].Matrica;
                     for (var j = 0; j < MatricaNova1.length; j++) {
                         MatricaNova1[j].zauzeto = 0;
                         MatricaNova1[j].znak = "";
                     }
                 }
                 SveIgre.update({"BrojSobe": data[i].BrojSobe}, {
                     $set: {
                         "Igrac2": {},
                         "Matrica": MatricaNova1,
                         "NaPotezu": {}
                     }
                 })
             }

             else if (data[i].NaPotezu.broj == data[i].Igrac1.broj) //izbaci igraca1
             {
                 MatricaNova1 = data[i].Matrica;
                 for (var j = 0; j < MatricaNova1.length; j++) {
                     MatricaNova1[j].zauzeto = 0;
                     MatricaNova1[j].znak = "";
                 }
                 SveIgre.update({"BrojSobe": data[i].BrojSobe}, {
                     $set: {
                         "Igrac1": {},
                         "Matrica": MatricaNova1,
                         "NaPotezu": {}
                     }
                 })
             }
         }
     }

 });

 },10000);

router.post('/:ime', function(req, res, next) { //kreiranje igra

  for(i=1;i<=5;i++) //Inicijalizacija matrice
  {
    for(j=1;j<=5;j++)
    {
      var Celija={pozicijax:1, pozicijay:1, zauzeto:1,znak:"X"};
      Celija.pozicijax=i;
      Celija.pozicijay=j;
      Celija.zauzeto=0;
      Celija.znak="";
      MatricaIgre.push(Celija);
    }
  }

  req.app.Igrac.ime = req.params.ime;    //Inicijalizacija igraca 1
  req.app.Igrac.znak = "X";
  req.app.Igrac.broj=req.app.NizBrojevaIgraca[req.app.brojac];
  BrojKreatoraIgre=req.app.Igrac;
  req.app.brojac++;
  req.app.Igrac.score=0;
  req.app.Igrac.vrijemepoteza=new Date();

  //Upis u bazu kreirane igre
  var soba="Soba"+req.app.NizKreiranihIgara[req.app.brojacNizaKreiranihIgara++];
  var j={"BrojSobe":soba,"Igrac1":req.app.Igrac,"Igrac2":{},"Matrica":MatricaIgre,"NaPotezu":{}};
  SveIgre.insert(j);

    res.send("Uspješno ste kreirali igru");
});

router.post('/Potez/:Soba/:brojIgraca/:x/:y', function(req, res, next) {

  SveIgre.find({},function(err,data) {

      BrDijagonala1O = 0;  //brojaci za pobjede, inicijalizirani na 0
      BrDijagonala1X = 0;
      BrhorizontalnoO = 0;
      BrhorizontalnoX = 0;
      BrvertikalnoO = 0;
      BrvertikalnoX = 0;

      for (var i = 0; i < data.length; i++) {

          if (data[i].Igrac2.ime != undefined) {
              if (data[i].BrojSobe == req.params.Soba) {
                  if (req.params.brojIgraca == data[i].NaPotezu.broj && req.params.x <= 5 && req.params.y <= 5) {
                      MatricaNova = data[i].Matrica;
                      for (var j = 0; j < MatricaNova.length; j++) {

                          if (MatricaNova[j].pozicijax == req.params.x && MatricaNova[j].pozicijay == req.params.y && MatricaNova[j].zauzeto == 0) {
                              MatricaNova[j].zauzeto = 1;
                              MatricaNova[j].znak = data[i].NaPotezu.znak;
                              if (data[i].NaPotezu.broj == data[i].Igrac1.broj) //biljezi vrijeme igranja igraca
                              {
                                  Igrac1_1 = data[i].Igrac1;
                                  Igrac1_1.vrijemepoteza = new Date();
                              }
                              else if (data[i].NaPotezu.broj == data[i].Igrac2.broj) {
                                  Igrac2_2 = data[i].Igrac2;
                                  Igrac2_2.vrijemepoteza = new Date();
                              }

                              if (data[i].NaPotezu.broj == data[i].Igrac2.broj) //Promjena poteza igraca
                                  SveIgre.update({"BrojSobe": req.params.Soba}, {
                                      $set: {
                                          "Igrac2": Igrac2_2,
                                          "Matrica": MatricaNova,
                                          "NaPotezu": data[i].Igrac1
                                      }
                                  });
                              else
                                  SveIgre.update({"BrojSobe": req.params.Soba}, {
                                      $set: {
                                          "Igrac1": Igrac1_1,
                                          "Matrica": MatricaNova,
                                          "NaPotezu": data[i].Igrac2
                                      }
                                  });

                          }
                      }
                  }
              }
              res.send("Uspješno ste odigrali potez");
          }
      }
  });
              SveIgre.find({},function(err,data) {

                  BrDijagonala1O = 0;
                  BrDijagonala1X = 0;
                  BrhorizontalnoO = 0;
                  BrhorizontalnoX = 0;
                  BrvertikalnoO = 0;
                  BrvertikalnoX = 0;

                  for (var i = 0; i < data.length; i++) {
                      MatricaRe=data[i].Matrica;
                      for(var u=0;u<MatricaRe.length;u++)
                      {
                          MatricaRe[u].zauzeto=0;
                          MatricaRe[u].znak="";
                      }
                      if (data[i].Igrac2.ime != undefined) {
                          if (data[i].BrojSobe == req.params.Soba) {
                              if (req.params.brojIgraca == data[i].NaPotezu.broj && req.params.x <= 5 && req.params.y <= 5) {

                                  //HOrizontalna pobjeda igraca1
                                  for (var h = 0; h < 5; h++) {
                                      for (var g = 0; g < 5; g++) {
                                          if (MatricaNova[h * 5 + g].pozicijax == (h + 1) && MatricaNova[h * 5 + g].pozicijay == (g + 1) && MatricaNova[h * 5 + g].zauzeto == 1) {

                                              if (MatricaNova[h * 5 + g].znak == "X") {
                                                  BrhorizontalnoX++;
                                                  console.log(BrhorizontalnoX);

                                                  if (BrhorizontalnoX == 2) {
                                                      res.send("Debil2");
                                                      if (data[i].Igrac1.broj == req.params.brojIgraca) {
                                                          Score = data[i].Igrac1;
                                                          Score.score = Score.score + 1;
                                                          SveIgre.update({
                                                              "BrojSobe": req.params.Soba
                                                          }, {$set: {"Igrac1": Score, "Matrica": MatricaRe}});
                                                      }
                                                  }
                                              }
                                              else if (MatricaNova[h * 5 + g].znak == "O") {
                                                  BrhorizontalnoX = 0;

                                              }
                                          }
                                      }
                                      BrhorizontalnoX = 0;
                                  }

                                  //Horizontalna pobjeda igraca2

                                  for (var h = 0; h < 5; h++) {
                                      for (var g = 0; g < 5; g++) {
                                          if (MatricaNova[h * 5 + g].pozicijax == (h + 1) && MatricaNova[h * 5 + g].pozicijay == (g + 1) && MatricaNova[h * 5 + g].zauzeto == 1) {

                                              if (MatricaNova[h * 5 + g].znak == "O") {
                                                  BrhorizontalnoO++;

                                                  if (BrhorizontalnoO == 2) {
                                                      if (data[i].Igrac2.broj == req.params.brojIgraca) {
                                                          Score = data[i].Igrac2;
                                                          Score.score = Score.score + 1;
                                                          SveIgre.update({
                                                              "BrojSobe": req.params.Soba
                                                          }, {$set: {"Igrac2": Score, "Matrica": MatricaRe}});
                                                      }
                                                  }
                                              }
                                              else if (MatricaNova[h * 5 + g].znak == "X") {
                                                  BrhorizontalnoO = 0;
                                              }
                                          }
                                      }
                                      BrhorizontalnoO = 0;
                                  }

                                  //Brojac vertikalno po X
                                  for (var h = 0; h < 5; h++) {
                                      for (var g = 0; g < 5; g++) {
                                          if (MatricaNova[g * 5 + h].pozicijax == (g + 1) && MatricaNova[g * 5 + h].pozicijay == (h + 1) && MatricaNova[g * 5 + h].zauzeto == 1) {

                                              if (MatricaNova[g * 5 + h].znak == "X") {
                                                  BrvertikalnoX++;

                                                  if (BrvertikalnoX == 2) {
                                                      if (data[i].Igrac1.broj == req.params.brojIgraca) {
                                                          Score = data[i].Igrac1;
                                                          Score.score = Score.score + 1;
                                                          SveIgre.update({
                                                              "BrojSobe": req.params.Soba
                                                          }, {$set: {"Igrac1": Score, "Matrica": MatricaRe}});
                                                      }
                                                  }
                                              }
                                              else if (MatricaNova[g * 5 + h].znak == "O") {
                                                  BrvertikalnoX = 0;
                                              }
                                          }
                                      }
                                      BrvertikalnoX = 0;
                                  }
                                  //Brojac vertikalno po O
                                  for (var h = 0; h < 5; h++) {
                                      for (var g = 0; g < 5; g++) {
                                          if (MatricaNova[g * 5 + h].pozicijax == (g + 1) && MatricaNova[g * 5 + h].pozicijay == (h + 1) && MatricaNova[g * 5 + h].zauzeto == 1) {

                                              if (MatricaNova[g * 5 + h].znak == "O") {
                                                  BrvertikalnoO++;

                                                  if (BrvertikalnoO == 2) {
                                                      if (data[i].Igrac2.broj == req.params.brojIgraca) {
                                                          Score = data[i].Igrac2;
                                                          Score.score = Score.score + 1;
                                                          SveIgre.update({
                                                              "BrojSobe": req.params.Soba
                                                          }, {$set: {"Igrac2": Score, "Matrica": MatricaRe}});
                                                      }
                                                  }
                                              }
                                              else if (MatricaNova[g * 5 + h].znak == "X") {
                                                  BrvertikalnoO = 0;
                                              }
                                          }
                                      }
                                      BrvertikalnoO = 0;
                                  }
                                  //Dijagonalna pobjeda igraca1
                                  for (var h = 0; h < 5; h++) {
                                      for (var g = 0; g < 5; g++) {
                                          if (MatricaNova[h * 5 + g].pozicijax == (h + 1) && MatricaNova[h * 5 + g].pozicijay == (g + 1) && MatricaNova[h * 5 + g].zauzeto == 1 && (h + 1) == (g + 1)) {

                                              if (MatricaNova[h * 5 + g].znak == "X") {
                                                  BrDijagonala1X++;

                                                  if (BrDijagonala1X == 2) {
                                                      if (data[i].Igrac1.broj == req.params.brojIgraca) {
                                                          Score = data[i].Igrac1;
                                                          Score.score = Score.score + 1;
                                                          SveIgre.update({
                                                              "BrojSobe": req.params.Soba
                                                          }, {$set: {"Igrac1": Score, "Matrica": MatricaRe}});
                                                      }
                                                  }
                                              }
                                              else if (MatricaNova[h * 5 + g].znak == "O") {
                                                  BrDijagonala1X = 0;

                                              }
                                          }
                                      }
                                  }

                                  //Dijagonalna pobjeda igraca2

                                  for (var h = 0; h < 5; h++) {
                                      for (var g = 0; g < 5; g++) {
                                          if (MatricaNova[h * 5 + g].pozicijax == (h + 1) && MatricaNova[h * 5 + g].pozicijay == (g + 1) && MatricaNova[h * 5 + g].zauzeto == 1 && (h + 1) == (g + 1)) {

                                              if (MatricaNova[h * 5 + g].znak == "O") {
                                                  BrDijagonala1O++;

                                                  if (BrDijagonala1O == 2) {
                                                      if (data[i].Igrac2.broj == req.params.brojIgraca) {
                                                          Score = data[i].Igrac2;
                                                          Score.score = Score.score + 1;
                                                          SveIgre.update({
                                                              "BrojSobe": req.params.Soba
                                                          }, {$set: {"Igrac2": Score, "Matrica": MatricaRe}});
                                                      }
                                                  }
                                              }
                                              else if (MatricaNova[h * 5 + g].znak == "X") {
                                                  BrDijagonala1O = 0;
                                              }
                                          }
                                      }
                                  }

                              }
        }
      }
    }
  });
});

module.exports = router;
