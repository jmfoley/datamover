

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


function dbConnectCallback(error,results){};

function callback(error,results){};




   function dbConnect(operatorid,dbConnectCallback) {

    var retVal;
    
    console.log('In TestConnect');

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


var connection = new Connection(config);

connection.on('debug', function(text) {
       // console.log(text);
    });

connection.on('connect',function(err){
    if(err){
        console.log('connect error');
        error = 'connect error';
        dbConnectCallback(error,null);
    

    }
    else {
        console.log('connected');
        var d = new Date();
        conn = connection;
        results = connection;
        error = null;
        //return conn;
        ChangeShard(operatorid,results,function(err,results){
         
         if(err) {
            dbConnectCallback(err,null);              
         } else {
            dbConnectCallback(null,results);
         }
      
        });
//        dbConnectCallback(null,results);
    


    }

});

connection.on('secure',function(text){
    console.log('***Encrypted connection made ' + text);


});

};



function ChangeShard(operatorId,connection,callback){


   var request = new Request('use federation [OperatorFederation] ([OperatorID] = ' + operatorId + ') with reset,filtering=on',function(err,rowCount){
   	//console.log(request);
        if(err){
         	console.log('***error =' + err);
        	callback(err,null);
        } else {
        	console.log('***changed shard');
        	callback(null,connection);
        }



   });

    connection.execSqlBatch(request);
}


function CheckOnlineMeters(connection,data,callback){

    var sql = 'select unitPropId from db_onlinemeters where unitid = @unit and itemid = @item and denom = @denom';

    var request = new Request(sql,function(err,rowCount) {
         if(err) {

         } else {
            
         } 
    });

}

function WriteOnlineMeters( connection,data,callback){

}

function WriteUnitEvents(connection,data,callback){

	
    var sql = 'insert into db_unitEvents(operatorid, recid,unitid,unitPropid,eventId,eventTime,cardId,cardCasinoId,amount,transactionNumber,deviceId,eventtypeid) ' +
    	      'values(@operatorid,@recid,@unitid,@unitpropid,@eventid,@date,@cardid,@cardcasinoid,@amount,@trans,@deviceid,@eventtypeid)';

	var request = new Request(sql,function(err,rowCount) {
        
        
        if(err){
        	callback(err,null);
        } else{
        	callback(null,results);
        }


	});
        request.addParameter('operatorid', TYPES.Int,data.operatorid);
        request.addParameter('recid', TYPES.Int,data.recid);
        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('unitpropid', TYPES.Int,data.propid);
        request.addParameter('eventid', TYPES.Int,data.eventid);
        request.addParameter('date', TYPES.DateTime,new Date());
        request.addParameter('cardid', TYPES.Int,data.cardid);
        request.addParameter('cardcasinoid', TYPES.Int,data.cardcasinoid);
        request.addParameter('amount', TYPES.Int,data.amount);
        request.addParameter('trans', TYPES.Int,data.transnumber);
        request.addParameter('deviceid', TYPES.Int,data.deviceid);
        request.addParameter('eventtypeid', TYPES.Int,data.eventtypeid);

        connection.execSql(request);
}


function WriteKioskData(data,callback){


    dbConnect(data.operatorid,function(error,results){
        if(error) {
            console.log('verify user error');
        } else {
             console.log("ok");
             // ChangeShard(10,results,function(err,results) {

             // });
             if(data.table === 'db_unitevents') {
             	WriteUnitEvents(results,data,function(err,results){
             		if(err){
             			console.log('WriteEvents error: ' + err);
             		} else{
             			console.log('Event written');
             		}

             	});
             }
             else if( data.table === 'db_onlinemeters') {

             }

         }


    });


}
exports.WriteKioskData = WriteKioskData;
;




