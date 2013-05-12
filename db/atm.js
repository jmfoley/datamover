var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';

function callback(error,results){};




function UpdateAtmTrans( data,callback){

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        
        if(err) {
          errMsg = 'GetDbConnection error: ' + err;
          callback(errMsg,null);
        } else {
        
             connection = results;
             sql = 'update db_atmTrans set transNumber = @trans,updated = @date where sequenceNum = @seq and unitId = @unitid and unitPropId = @prop';

             var request = new Request(sql,function(err,rowCount) {
             
               if(err){
                   errMsg = 'UpdateAtmTrans error: ' + err;
                   connection.close();
                   connection = null;
                   sql = null;
                   delete request;

                   callback(errMsg,null);               
               } else {
                   connection.close();
                   connection = null;
                   sql = null;
                   delete request;

                   callback(null,rowCount);
               }

             });

            //request.addParameter('oper', TYPES.Int,data.operatorid);
            request.addParameter('unitid', TYPES.Int,data.unit);
            request.addParameter('prop', TYPES.Int,data.propid);
            request.addParameter('trans', TYPES.Int,data.trans);
            request.addParameter('seq', TYPES.Int,data.seq);
            request.addParameter('date', TYPES.DateTime, new Date());

            connection.execSql(request);



        }
    });

} exports.UpdateAtmTrans = UpdateAtmTrans
;



function WriteAtmTrans( data,callback) {
    
    var sql = '';
    var connection;


    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        
        if (err) {
          errMsg = 'GetDbConnection error: ' + err;
        	callback(errMsg,null);
        } else {
       
            connection = results;
            sql = 'insert into db_atmTrans(recid,operatorID,unitId,unitPropId,terminalId,transCode,acctType,sequenceNum,responseCode,authNum,transDate,' +
            	    'transTime,businessDate,amount1,amount2,cardLast4,updated)values(newid(),@oper,@unitid,@propid,@termid,@transcode,@accttype,@seqnum,@rescode,' +
            	    '@authnum,@transdate,@transtime,@busdate,@amt1,@amt2,@last4,@updated)';

                  var request = new Request(sql,function(err,rowCount) {
                  if (err) {
                    errMsg = 'WriteAtmTrans Error: ' + err;
                      connection.close();
                      connection = null;
                      sql = null;
                      delete request;

                  	  callback(errMsg,null) ;
                  } else {
                       connection.close();
                       connection = null;
                       sql = null;
                       delete request;

                  	   callback(null,rowCount);
                  }
              }); 
 

            request.addParameter('oper', TYPES.Int,data.operatorid);
	          request.addParameter('unitid', TYPES.Int,data.unit);
	          request.addParameter('propid', TYPES.Int,data.propid);
	          request.addParameter('termid', TYPES.NVarChar,data.terminalid);
	          request.addParameter('transcode', TYPES.NVarChar,data.transcode);
	          request.addParameter('accttype', TYPES.NVarChar, data.accttype);
	          request.addParameter('seqnum', TYPES.Int,data.seq);
	          request.addParameter('rescode', TYPES.Int,data.response);
	          request.addParameter('authnum', TYPES.Int,data.auth);
	          request.addParameter('transdate', TYPES.Int,data.transdate);
	          request.addParameter('transtime', TYPES.Int,data.transtime);
	          request.addParameter('busdate', TYPES.Int,data.busdate);
	          request.addParameter('amt1', TYPES.Int,data.amt1);
	          request.addParameter('amt2', TYPES.Int,data.amt2);
	          request.addParameter('last4', TYPES.NVarChar,data.last4);
	          request.addParameter('updated', TYPES.DateTime,new Date());


	           connection.execSql(request);
              
        }

    });

} exports.WriteAtmTrans = WriteAtmTrans
;