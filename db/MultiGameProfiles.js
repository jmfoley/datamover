var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';

function callback(error,results){};



exports.SaveMultiGameProfileDetail = function(data,callback) {
	var sql = '';
	var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
         if(err){
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);
         } else {
         	connection = results;
             sql = 'insert into sc_multigameprofiledetail(operatorId,recId,gameNumber,gameDesc,parPct,maxBet,denom,updated, ' +
             	   'updatedBy,payTableId)values(@oper,@recid,@game,@desc,@par,@max,@denom,@date,@updatedby,@paytableid)';


             var request = new Request(sql,function(err,results) {

                if (err) {
                    errMsg = 'SaveMultiGameProfileDetail error: '  + err;
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
                     callback(null,results);
                }

            });

                request.addParameter('oper', TYPES.Int,data.operatorid);
                request.addParameter('recid', TYPES.UniqueIdentifierN,data.recid);
                request.addParameter('game', TYPES.Int,data.gamenumber);
                request.addParameter('desc', TYPES.VarChar,data.gamedesc);
                request.addParameter('par', TYPES.Float, data.parpct);
                request.addParameter('max', TYPES.Int, data.maxbet);
                request.addParameter('denom', TYPES.Int, data.denom);
                request.addParameter('date', TYPES.DateTime, new Date());
                request.addParameter('updatedby', TYPES.VarChar,data.updatedby);
                request.addParameter('paytableid', TYPES.VarChar,data.paytableid);

                connection.execSql(request);



         }

     });


}


exports.SaveMultiGameProfile = function(data,callback) {
	var sql = '';
	var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
         if(err){
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);
         } else {
         	connection = results;
             sql = 'insert into sc_multigameprofile(operatorId,recId,manufId,profileDesc,updated)values(@oper,@recid, ' +
             	   '@manuf,@desc,@date)';

             var request = new Request(sql,function(err,results) {

                if (err) {
                    errMsg = 'SaveMultiGameProfile error: '  + err;
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
                     callback(null,results);
                }

            });


                request.addParameter('oper', TYPES.Int,data.operatorid);
                request.addParameter('recid', TYPES.UniqueIdentifierN,data.recid);
                request.addParameter('manuf', TYPES.VarChar,data.manufid);
                request.addParameter('desc', TYPES.VarChar,data.profiledesc);
                request.addParameter('date', TYPES.DateTime, new Date());
                
                connection.execSql(request);
            

         }	
     });
   }


exports.UpdateMachineProfile = function( data,callback) {
    var sql = '';
    var connection;
    var insert = false;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
         if(err){
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);
         } else {
         	connection = results;
         	if(data.operation === 'insert') {
         		insert = true;
         		sql = 'insert into db_multigamemachineprofile( OperatorId,machineNumber,propId,profileId,updated,updatedBy) values( ' +
         			  '@oper,@mach,@prop,@id,@date,@updatedby)';

         	} else if (data.operation === 'update') {
         		sql = 'update db_multigamemachineprofile set profileId = @id,updatedBy = @updatedby,updated = @date where ' +
         		      'machineNumber = @mach and propid = @prop';
         	}

             var request = new Request(sql,function(err,results) {

                if (err) {
                    errMsg = 'UpdateMachineProfile error: '  + err;
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
                     callback(null,results);
                }

            });

                if(insert) {
                    request.addParameter('oper', TYPES.Int,data.operatorid);
                }

                request.addParameter('mach', TYPES.Int,data.machinenumber);
                request.addParameter('id', TYPES.VarChar,data.profileid);
                request.addParameter('updatedby', TYPES.VarChar,data.updatedby);
                request.addParameter('prop', TYPES.Int,data.propId);
                request.addParameter('date', TYPES.DateTime, new Date());
                
                connection.execSql(request);


         }
     });


}