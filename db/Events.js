var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')


function callback(error,results){};


function WriteKioskEvents(data,callback) {

    
    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

         if(err){
         	callback(err,null);
         } else {

            var connection = results;
            var sql = 'insert into db_unitEvents(operatorid, recid,unitid,unitPropid,eventId,eventTime,cardId,cardCasinoId,amount,transactionNumber,deviceId,eventtypeid) ' +
    	              'values(@operatorid,@recid,@unitid,@unitpropid,@eventid,@date,@cardid,@cardcasinoid,@amount,@trans,@deviceid,@eventtypeid)';

	        var request = new Request(sql,function(err,rowCount) {
        
        
            if(err){
        	    connection.close();
        	    callback(err,null);
        	
            } else{
        	    connection.close();
        	    callback(null,connection);
        	
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


    });

 //    var sql = 'insert into db_unitEvents(operatorid, recid,unitid,unitPropid,eventId,eventTime,cardId,cardCasinoId,amount,transactionNumber,deviceId,eventtypeid) ' +
 //    	      'values(@operatorid,@recid,@unitid,@unitpropid,@eventid,@date,@cardid,@cardcasinoid,@amount,@trans,@deviceid,@eventtypeid)';

	// var request = new Request(sql,function(err,rowCount) {
        
        
 //        if(err){
 //        	connection.close();
 //        	callback(err,null);
        	
 //        } else{
 //        	connection.close();
 //        	callback(null,results);
        	
 //        }


	// });
 //        request.addParameter('operatorid', TYPES.Int,data.operatorid);
 //        request.addParameter('recid', TYPES.Int,data.recid);
 //        request.addParameter('unitid', TYPES.Int,data.unit);
 //        request.addParameter('unitpropid', TYPES.Int,data.propid);
 //        request.addParameter('eventid', TYPES.Int,data.eventid);
 //        request.addParameter('date', TYPES.DateTime,new Date());
 //        request.addParameter('cardid', TYPES.Int,data.cardid);
 //        request.addParameter('cardcasinoid', TYPES.Int,data.cardcasinoid);
 //        request.addParameter('amount', TYPES.Int,data.amount);
 //        request.addParameter('trans', TYPES.Int,data.transnumber);
 //        request.addParameter('deviceid', TYPES.Int,data.deviceid);
 //        request.addParameter('eventtypeid', TYPES.Int,data.eventtypeid);

 //        connection.execSql(request);


} exports.WriteKioskEvent = WriteKioskEvents;
;