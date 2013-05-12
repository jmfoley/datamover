
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')




function callback(error,results){};


function WriteDropMeters( data,callback) {

   var connection;
   var errMsg = '';
   var sql = '';

   dbConnect.GetDbConnection(data.operatorid,function(err,results) {
      if (err) {
          errMsg = 'GetDbConnection error: ' + err;
          callback(errMsg,null);
      } else {
          connection = results; 
          sql = 'insert into db_unitDropMeters(operatorID,transNumber,unitId,propId,itemId,itemDenom,itemAmount,' +
                'canId,fillAmt,impressAmt,updated)values(@oper,@trans,@unitId,@propid,@item,@denom,@amount,@can,@fill,' +
                '@impress,@date)';
          var request = new Request(sql,function(err,rowCount) {
               if (err) {
                  connection.close();
                  connection = null;
                  sql = null;
                  delete request;

                  errMsg = 'WriteDropDetail error: '  + err;
                  callback(errmsg,null);

               } else {
                  connection.close();
                  connection = null;
                  sql = null;
                  delete request;

                  callback(null,rowCount);
               }

          });

          request.addParameter('oper', TYPES.Int,data.operatorid);
          request.addParameter('trans', TYPES.Int,data.trans);
          request.addParameter('unitid', TYPES.Int,data.unit);
          request.addParameter('propid', TYPES.Int,data.propid);
          request.addParameter('item', TYPES.VarChar,data.item);
          request.addParameter('denom', TYPES.Int,data.denom);
          request.addParameter('amount', TYPES.Int,data.amount);
          request.addParameter('can', TYPES.Int,data.canid);
          request.addParameter('fill', TYPES.Int,data.fillamt);
          request.addParameter('impress', TYPES.Int,data.impress);          
          request.addParameter('date', TYPES.DateTime,new Date());

          
          connection.execSql(request);
 
      }


   });



}exports.WriteDropMeters = WriteDropMeters;






function WriteDropDetail( data,callback) {

   var connection;
   var errMsg = '';
   var sql = '';

   dbConnect.GetDbConnection(data.operatorid,function(err,results) {
      if (err) {
          errMsg = 'GetDbConnection error: ' + err;
          callback(errMsg,null);
      } else {
          connection = results; 
          sql = 'insert into db_unitTransDrop(operatorID,transNumber,unitId,propId,itemId,itemDenom,itemAmount,actualAmount,' +
                'canId,updated,kioskTransNumber)values(@oper,@trans,@unitId,@propid,@item,@denom,@amount,@actamount,@can,@date,' +
                '@trans1)';
          var request = new Request(sql,function(err,rowCount) {
               if (err) {
                  connection.close();
                  connection = null;
                  sql = null;
                  delete request;

                  errMsg = 'WriteDropDetail error: '  + err;
                  callback(errmsg,null);

               } else {
                  connection.close();
                  connection = null;
                  sql = null;
                  delete request;

                  callback(null,rowCount);
               }

          });

          request.addParameter('oper', TYPES.Int,data.operatorid);
          request.addParameter('trans', TYPES.Int,data.trans);
          request.addParameter('unitid', TYPES.Int,data.unit);
          request.addParameter('propid', TYPES.Int,data.propid);
          request.addParameter('item', TYPES.VarChar,data.item);
          request.addParameter('denom', TYPES.Int,data.denom);
          request.addParameter('amount', TYPES.Int,data.amount);
          request.addParameter('actamount', TYPES.Int,data.actualamount);
          request.addParameter('can', TYPES.Int,data.canid);
          request.addParameter('date', TYPES.DateTime,new Date());
          request.addParameter('trans1', TYPES.Int,data.kiosktrans);
          
          connection.execSql(request);
 
      }


   });



}exports.WriteDropDetail = WriteDropDetail;


function CheckOnlineDropMeters(connection,data,callback) {

    var errMsg = '';

    var sql = 'select unitPropId from db_onlinemeters where unitId = @unitid and itemId = @itemid and ' +
              'unitPropid = @propid and denom = @denom';

    var request = new Request(sql,function(err,rowCount) {
    	if (err) {
            errMsg = 'CheckOnlineDropMeters error: '  + err;
            sql = null;
    		    callback(errMsg,null);
    	} else {
          sql = null;            
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
                    if (results > 0) {

                        sql = 'update db_onlinemeters set itemAmount = @amount, impressamt = @impress,canId = @can, ' +
                              'itemQty = @qty,fillAmt = @fillamt,updated = @date where unitId = @unit and unitPropId = @propid and ' +
                              'itemId = @item and denom = @denom';
                    } else {

                        sql = 'insert into db_onlinemeters(operatorID,unitId,unitPropId,itemId,itemAmount,updated,denom,impressAmt,' +
                              'canId,itemQty,fillAmt)values(@oper,@unit,@propid,@item,@amount,@date,@denom,@impress,@can,@qty,@fillamt)';
                              insert = true;
                    }

                    var request = new Request(sql,function(err,results) {
                        if (err) {
                            connection.close();
                            connection = null;
                            sql = null;
                            delete request;

                            callback(err,null);
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