//This file is going to be a complete hack due to all the "great ideas" of how the drop/fill should be done.

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';



function callback(error,results){};


function CheckOnlineDropMeters(connection,data,callback) {

    var sql = 'select unitPropId from db_onlinemeters where unitId = @unitid and itemId = @itemid and ' +
              'unitPropid = @propid and denom = @denom';

    var request = new Request(sql,function(err,rowCount) {
    	if (err) {
            errMsg = 'CheckOnlineDropMeters error: '  + err;
    		callback(errMsg,null);
    	} else {
             
    		callback(null,rowCount);
    	}

    });          


        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('itemid', TYPES.VarChar,data.item);
        request.addParameter('denom', TYPES.Int,data.denom);
        request.addParameter('propid', TYPES.Int,data.propid);
        
        connection.execSql(request);

};



function UpdateOnlineDropMeters( data,callback) {

    var errMsg = '';
    var connection;
    var insert;
    var sql = '';

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

        } else {
            connection = results;
            CheckOnlineDropMeters(connection,data,function(err,results) {
                if (err) {
                    callback(err,null);                    
                } else {
                    console.log('***Count = ' + results);
                    if (results > 0) {
                      console.log('In Update Code');
                        sql = 'update db_onlinemeters set itemAmount = @amount, impressamt = @impress,canId = @can, ' +
                              'itemQty = @qty,fillAmt = @fillamt,updated = @date where unitId = @unit and unitPropId = @propid and ' +
                              'itemId = @item and denom = @denom';
                    } else {
                      console.log('In Insert Code');
                        sql = 'insert into db_onlinemeters(operatorID,unitId,unitPropId,itemId,itemAmount,updated,denom,impressAmt,' +
                              'canId,itemQty,fillAmt)values(@oper,@unit,@propid,@item,@amount,@date,@denom,@impress,@can,@qty,@fillamt)';
                              insert = true;
                    }

                    var request = new Request(sql,function(err,results) {
                        if (err) {
                            connection.close();
                            console.log('Denom = ' + data.denom);
                            callback(err,null);
                        } else {
                            connection.close();
                            callback(null,results);
                        }

                    });

                      if(insert) {
                          request.addParameter('oper', TYPES.Int,data.operatorid);
                      }
                      request.addParameter('unit', TYPES.Int,data.unit);  
                      request.addParameter('propid', TYPES.Int,data.propid);
                      request.addParameter('item', TYPES.NVarChar,data.item);
                      request.addParameter('amount', TYPES.Int, data.amount);
                      request.addParameter('denom', TYPES.Int,data.denom);
                      request.addParameter('qty', TYPES.Int,data.quantity);
                      request.addParameter('date', TYPES.DateTime,new Date());
                      request.addParameter('impress', TYPES.Int,data.impress);
                      request.addParameter('can', TYPES.Int,data.canid);
                      request.addParameter('fillamt', TYPES.Int,data.fillamt);


                      connection.execSql(request);
                  }

               

            });
        }
    });


}exports.UpdateOnlineDropMeters = UpdateOnlineDropMeters;