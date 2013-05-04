
/**
 * Module dependencies.
 */


// require('nodetime').profile({
//     accountKey: '88e4906e6971ed06be1ccf957192b9c6254acb81', 
//     appName: 'datamover'
//   });

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , https = require('https')
  , fs = require('fs')
  , dbConnect = require('./db/DbConnectionPool')
  , path = require('path')
  //, KioskEvents = require('./db/Events')
  , tableFilter = require('./db/TableFilter')
  , cluster = require('cluster')
  , numCPUs = require('os').cpus().length
  , ua = require('mobile-agent');

  var startDate = new Date();
  var totalTransReceived = new Number(0);
  var totalSuccessfulTrans = new Number(0);
  var totalErrorTrans = new Number(0);

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

//app.get('/', routes.index);
app.get('/',function(req,res) {
    var agent = ua(req.headers['user-agent']);
    if( agent.Mobile === true && agent.iPad === false){
          console.log('mobile');
          res.render('index-mobile',{
              title:'mobile'
          });
    }else {
      console.log('desktop');
      res.render('index',{
        title:'Desktop View'
      });
    }
});



app.get('/stats', function(req,res){

var stats =
    {
      "startDate": startDate.getMonth() + 1 + '-' + startDate.getDate() + '-' + startDate.getFullYear() + ' ' + startDate.getHours() +
                   ':' + startDate.getMinutes() + ':' + startDate.getSeconds(),
      "totalTrans":totalTransReceived,
      "totalErrTrans":totalErrorTrans,
      "totalSuccessfulTrans":totalSuccessfulTrans
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(stats));


});


app.post('/kioskdata',function(req,res) {


     tableFilter.ProcessTrans(req.body,function(err,results){
         totalTransReceived++;

         if (err) {
              totalErrorTrans++;
              
              console.log(err);
              res.writeHead(401, {'Content-Type': 'text/plain'});
              res.end('');

         } else {

              totalSuccessfulTrans++;

              console.log('data written');
              res.writeHead(200, {'Content-Type': 'text/plain'});
              res.end('');

         }
     });

       
});



app.get('/commcheck',function(req,res){
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('OK');

});



app.post('/slotdata',function(req,res){

});

var options = {
    key: fs.readFileSync('./m3key.pem'),
    cert: fs.readFileSync('./m3-cert.pem')
};



if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  
    https.createServer(options, app).listen(app.get('port'),function(){

    console.log("https Express server listening on port " + app.get('port'));
});



 // http.createServer(app).listen(app.get('port'), function(){
 //  console.log("Express server listening on port " + app.get('port'));
 // });

}