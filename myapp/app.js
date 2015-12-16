var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//RUTICEEEE
var routes = require('./routes/index');  /// sve se u ovajjj use mora dodat i kreirat se varijable, jer je ovo kao neka ogromna klasa :D
var users = require('./routes/users');
var ilvana=require('./routes/ilvana');
var Kreiranjeigre =require('./routes/Kreiranjeigre');
var JoinIgre=require('./routes/JoinIgre');
var db = require('monk')('localhost/iksoks');
var Nastavi=require('./routes/Nastavi');
//VARIJABLEEE
var mojabaza = { ///objekattttt
  users:{
    ilvana:{}
  }
};


 var Igrac= {                                   //nas famozni igrac
   ime: 'Amina', broj:1, znak:'x', score:0, vrijemepoteza:new Date()};

var NizBrojevaIgraca=[];
for (var i = 0, l = 2400; i < l; i++) {
  NizBrojevaIgraca.push(Math.round(Math.random() * l));
}

var Igra={
  BrojSobe:"sajhhsa", Igrac1:{},Igrac2:{}};

var NizKreiranihIgara=[]; ///BROJEVII IGRARAAAAAA
for (var i = 400, l = 1600; i < l; i++) {
  NizKreiranihIgara.push(Math.round(Math.random() * l));
}
var brojacNizaKreiranihIgara=0;
var NovaIgra;
var brojac=0;
 var NizAktivnihIgara=new Array(100);
var brojacNizaAktivnihIgara=0;
var text="";
//var MatricaIgre=new Array(625);


//  DODAJ SVE VARIJABLE OVDJEEE
var app = express();
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
  res.header('Access-Control-Allow-Headers', 'Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
};

// CORS
app.use(allowCrossDomain);
app.brojacNizaKreiranihIgara=brojacNizaKreiranihIgara;
app.NizAktivnihIgara=NizAktivnihIgara;
app.Igra=Igra;
app.text=text;
app.brojacNizaAktivnihIgara=brojacNizaAktivnihIgara;
app.NovaIgra=NovaIgra;
app.mojabaza = mojabaza;
app.Igrac=Igrac;
app.NizBrojevaIgraca=NizBrojevaIgraca;
app.brojac=brojac;
//app.MatricaIgre=MatricaIgre;

app.NizKreiranihIgara=NizKreiranihIgara;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//DODAJ SVE RUTICE
app.use('/', routes);
app.use('/users', users);
app.use('/ilvana', ilvana);
app.use('/Kreiranjeigre',Kreiranjeigre);
app.use('/JoinIgre',JoinIgre);
app.use('/Nastavi',Nastavi);



//GRESKICEE
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  //res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
