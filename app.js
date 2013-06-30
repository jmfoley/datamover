
/**
 * Module dependencies.
 */


// require('nodetime').profile({
//     accountKey: '88e4906e6971ed06be1ccf957192b9c6254acb81', 
//     appName: 'datamover'
//   });

//require('look').start();
var memwatch = require('memwatch');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  //, http = require('http')
  , https = require('https')
  , fs = require('fs')
  , dbConnect = require('./db/DbConnectionPool')
  , path = require('path')
  //, KioskEvents = require('./db/Events')
  , kioskTableFilter = require('./db/KioskTableFilter')
  , cluster = require('cluster')
  , numCPUs = require('os').cpus().length
  , ua = require('mobile-agent')
  , Utils  = require('./db/Utils')
  , slotTableFilter = require('./db/SlotTableFilter')
  , mailer = require('./db/Mailer');

  var util = require('util');


memwatch.on('leak', function(info) { 
  console.log('Memory leak detected: ' + util.inspect(info));
 // var data = util.inspect(info);
 // mailer.SendMemLeakReport(data,function(err,results) {

  //});
  
});


 memwatch.on('stats', function(stats) { 
   //console.log('mem stats: ' + util.inspect(stats));
 });


if (cluster.isMaster) {
  // function messageHandler(msg) {
  //   if (msg.cmd && msg.cmd == 'totalTrans') {
  //      totalTransReceived++;
  //   } else if (msg.cmd && msg.cmd == 'totalErrors') {
  //     totalErrorTrans++;
  //   } else if (msg.cmd && msg.cmd == 'totalSuccess') {
  //     totalSuccessfulTrans++;
  //   }
  // }

  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

// Object.keys(cluster.workers).forEach(function(id) {
//     cluster.workers[id].on('message', messageHandler);
//   });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {


  var startDate = new Date();
  var totalTransReceived = new Number(0);
  var totalSuccessfulTrans = new Number(0);
  var totalErrorTrans = new Number(0);



var timer = (1000 * 60) * 10;

setInterval(function(){
  global.gc();
  console.log('Mem used: ' + util.inspect(process.memoryUsage())); 
},timer);


var app = express();




app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(express.cookieParser('your secret here'));
  //app.use(express.session());
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
          res.set({
           'Connection': 'close',
          })

          res.render('index-mobile',{
              title:'mobile'
          });
    }else {
      console.log('desktop');
      res.set({
       'Connection': 'close',
      })

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

    stats = null;
    delete req;
    delete res;


});

//var hd = new memwatch.HeapDiff();
app.post('/kioskdata',function(req,res) {


     kioskTableFilter.ProcessTrans(req.body,function(err,results){
         totalTransReceived++;
        // process.send({ cmd: 'totalTrans' });


         if (err) {
              totalErrorTrans++;
   
              delete req;
              console.log(err);
              res.writeHead(401, {'Content-Type': 'text/plain'});
              res.end('');

         } else {
             // process.send({ cmd: 'totalSuccess' });
              totalSuccessfulTrans++;
              delete req; 

              res.set({
               'Content-Type': 'text/plain',
               'Connection': 'close',
              })



              res.send(200);
              delete res;
              res = null;

         }
     });


});



app.get('/commcheck',function(req,res){
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('OK');

});

app.post('/crash',function (req,res) {
    console.log('crash called');
    mailer.SendReport(req.body,function(err,results) {
      if (err) {
        console.log(err);
      }

    });
});

app.post('/slotdata',function(req,res){

     slotTableFilter.ProcessTrans(req.body,function(err,results){
         totalTransReceived++;
        // process.send({ cmd: 'totalTrans' });

         if (err) {
              totalErrorTrans++;
   
              delete req;
              console.log(err);
              res.writeHead(401, {'Content-Type': 'text/plain'});
              res.end('');

         } else {
             // process.send({ cmd: 'totalSuccess' });
              totalSuccessfulTrans++;
              delete req; 
              //console.log('data written');

              res.set({
               'Content-Type': 'text/plain',
               'Connection': 'close',
              })



              res.send(200);



              // res.writeHead(200, {'Content-Type': 'text/plain'});
              // res.end('');

         }
     });


});

var options = {

    key: fs.readFileSync( __dirname + 'ssl key'),
    cert: fs.readFileSync(__dirname + 'ssl cert')
};







  
    https.createServer(options, app).listen(app.get('port'),function(){
    console.log("https Express server listening on port " + app.get('port'));
});


 // http.createServer(app).listen(app.get('port'), function(){
 //  console.log("Express server listening on port " + app.get('port'));
 // });


}

 // http.createServer(app).listen(app.get('port'), function(){
 //  console.log("Express server listening on port " + app.get('port'));
 // });

//});



//     https.createServer(options, app).listen(app.get('port'),function(){

//     console.log("https Express server listening on port " + app.get('port'));
// });
