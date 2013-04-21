var dbConnect = require('./DbConnectionPool1');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Q = require('q');

function callback(error,results){};

    var config = {
        userName: 'M3tech!@ncn55muurk',
        password: 'r@fdM3Al!',
        server: 'ncn55muurk.database.windows.net',
         tdsVersion: '7_2',
            options: {
                encrypt: true,
                database: 'm3_Fed_Root',
        
            debug: {
               packet:  true,
               data:    true,
               payload: true,
               log:     true 
        }
    }
 
};


var poolConfig = {
   min: 1,
   max: 20,
   idleTimeoutMillis: 10000
};


var outPromise = GetUnitOnlineMeters(function(err,results) {
    

});


function GetUnitOnlineMeters(callback) {
    
    var promise = dbConnect.GetDbConnection(10);
    promise.then(function(error) {
        console.log(error)
    });


    // Q.fcall( dbConnect.GetDbConnection(10))
    //  .fail(null,function(error){
    //       console.log(error);
    //  }); 

     

};














// function GetUnitEvents(connection,callback){

//        var request = new Request('select * from db_onlinemeters where unitid = @unitid and itemid = @itemid', function(err, rowCount) {
//        if(err) {

//             console.log('select err: ' + err);
//         } else {
//             console.log(rowCount);
//             connection.close();
//         }


//     });

//       request.addParameter('unitid', TYPES.Int, '40');
//       request.addParameter('itemid', TYPES.NVarChar, 'CC0');
//        connection.execSql(request);
//      };




// var pool = new ConnectionPool(poolConfig, config);

// pool.requestConnection(function (err, connection) {
//       if(err) {
//         colsole.log('connection pool error: ' + err);
//       } else {
//          console.log('Connected');

//          var request = new Request('use federation [OperatorFederation] ([OperatorID]=10) with reset,filtering=on', function(err, rowCount) {
//          if(err) {

//                console.log('Federation error: ' + err);
//          } else {
//               console.log('changed fed');
//               GetUnitEvents(connection,function(err,results) {

//               });

//         }
//       });
           
//               connection.on('connect', function(err) {
//               connection.execSqlBatch(request);
//           });

//           connection.on('end', function(err){
//               console.log('Connection closed') ;
//           });

// }      

// });