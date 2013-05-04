

var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;

function DbConnectCallback(error,results){};

    var config = {
        userName: 'db user here',
        password: 'db password here',
        server: 'db server herer',
         tdsVersion: '7_2',
            options: {
                encrypt: true,
                database: 'defaut db connection here',
        
            debug: {
               packet:  true,
               data:    true,
               payload: true,
               log:     true 
        }
    }
 
};


var poolConfig = {
   min: 0,
   max: 50,
   idleTimeoutMillis: 10000
};


 pool = new ConnectionPool(poolConfig, config);

 function GetDbConnection(operatorid,DbConnectCallback) {
 
     pool.requestConnection(function (err, connection) {
         
         if(err) {
         	DbConnectCallback(err,null);
         } else {
         	console.log('connected from pool');

             var request = new Request('use federation [OperatorFederation] ([OperatorID]=' + operatorid + ') with reset,filtering=on', function(err, rowCount) {
             if(err) {
                console.log('Federation error: ' + err);
                DbConnectCallback(err,null);
             } else {
                  console.log('changed fed');
                  DbConnectCallback(null,connection);


             }
      });
           
              connection.on('connect', function(err) {
              connection.execSqlBatch(request);
          });

          connection.on('end', function(err){
              console.log('Connection closed') ;
          });

              

         }





     });



 } exports.GetDbConnection = GetDbConnection;
 ;