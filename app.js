
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , https = require('https')
  , fs = require('fs')
  //, db = require('./db/azureDb')
  , dbConnect = require('./db/DbConnectionPool')
  , path = require('path')
  , KioskEvents = require('./db/Events')
  ,tableFilter = require('./db/TableFilter');

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


     tableFilter.ProcessTrans(req.body,function(err,results){
         if (err) {
              console.log(err);
              res.writeHead(401, {'Content-Type': 'text/plain'});
              res.end('');

         } else {
              console.log('data written');
              res.writeHead(200, {'Content-Type': 'text/plain'});
              res.end('');

         }
     });

       
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


// http.createServer(app).listen(app.get('port'), function(){
//  console.log("Express server listening on port " + app.get('port'));
// });
