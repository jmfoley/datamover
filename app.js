
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , https = require('https')
  , fs = require('fs')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);


app.post('/kioskdata',function(req,res) {
    var data = req.body;
    console.log('Ticket Status: ' + data.TicketStatus);
    console.log(JSON.stringify(req.body));
});

app.post('/slotdata',function(req,res){

});

var options = {
    key: fs.readFileSync('./m3key.pem'),
    cert: fs.readFileSync('./m3-cert.pem')
};


https.createServer(options, app).listen(app.get('port'),function(){

    console.log("https Express server listening on port " + app.get('port'));
});


//http.createServer(app).listen(app.get('port'), function(){
//  console.log("Express server listening on port " + app.get('port'));
//});
