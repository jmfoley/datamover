var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')

function callback(error,results){};


//Online meters
function CheckOnlineMeters(connection,data,callback) {

    var sql = 'select unitPropId from db_onlinemeters where unitId = @unitid and itemId = @itemid and denom = @denom ' +
              'and unitPropid = @propid';

    var request = new Request(sql,function(err,rowCount) {
    	if(err) {

    		callback(err,null);
    	} else {
             
    		callback(null,rowCount);
    	}

    });          

        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('itemid', TYPES.NVarChar,data.item);
        request.addParameter('denom', TYPES.Int,data.denom);
        request.addParameter('propid', TYPES.Int,data.propid);
        
        connection.execSql(request);

};



function UpdateOnlineMeters(data,callback){

    var sql = '';
    var connection;
    var insert;
    var itemAmounts = '';


    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

         if(err){
         	callback(err,null);
         } else {
             
             connection = results;
             CheckOnlineMeters(connection,data,function(err,results) {
                 
                 if(err){
                 	callback(err,null);
                 } else {
                 
                      if(results > 0) {
                      	//update record
           	            console.log('rowCount = ' + results);  
           	            insert = false; 

   				      if( data.item === 'VC1' || data.item === 'VT1' || data.item === 'VC2' || data.item === 'VT2' || data.item === 'CCR' ||
					      data.item === 'ATM' || data.item === 'MTR' || data.item === 'TCD' || data.item === 'TDT' || data.item === 'TFT' ||
					      data.item === 'HPT' )  {

					   	     itemAmounts = 'itemqty = itemqty + @quantity,itemamount = itemamount + @amount ';

					      } else {

					      	    itemAmounts = 'itemamount = itemamount - @amount, itemqty = itemqty - @quantity ';
					      }
                      
                          sql = 'update db_onlinemeters set ' + itemAmounts + ',updated = @date where unitId = @unitid and unitPropId = @propid and ' +
                                'itemId = @item and denom = @denom'; 
                      }
                      else {
                      	//insert record
                      	insert = true;

                      	sql = 'insert into db_onlinemeters(itemAmount,updated,unitId,unitPropId,itemId,denom,itemQty,operatorId)values(' +
                      		  '@amount,@date,@unitid,@propid,@item,@denom,@quantity,@operatorid)';
                      }

			          
                      var request = new Request(sql,function(err,rowCount) {
                          if(err) {
                              connection.close();
                          	  callback(err,null) ;
                          } else {
                               connection.close();
                          	   callback(null,rowCount);
                          }
                      }); 
                       


 
                      if(insert) {
			              request.addParameter('oper', TYPES.Int,data.operatorid);
			          }
			          request.addParameter('unitid', TYPES.Int,data.unit);
			          request.addParameter('propid', TYPES.Int,data.propid);
			          request.addParameter('item', TYPES.NVarChar,data.item);
			          request.addParameter('amount', TYPES.Int, data.amount);
			          request.addParameter('denom', TYPES.Int,data.denom);
			          request.addParameter('quantity', TYPES.Int,data.quantity);
			          request.addParameter('date', TYPES.DateTime,new Date());

			           connection.execSql(request);

                 }




             });



         }

     });
     

} exports.UpdateOnlineMeters = UpdateOnlineMeters
;

//End online meters


//LTD meters 

function UpdateTotalInMeter(connection,data,item,amount,callback) {

    var sql = '';
    var insert;

    CheckOnlineMeters(connection,data,function(err,results) {

    if (err)  {
         callback(err,null);
    } else {

         if(results > 0) {
             //update
             insert = false;
             sql = 'update db_LTDMeters set meterAmount = meterAmount + @amount,updated = @date where unitId = @unitid and unitPropId = @prop ' +
                   'and itemId = @item';
         } else {
             //insert
             insert = true;
             sql = 'insert into db_LTDMeters(unitId,unitPropId,itemId,meterAmount,updated,denom,operatorId)values(@unitid,@prop,' +
                   '@amount,@date,@oper)';
         }

         var request = new Request(sql,function(err,rowCount) {
         if(err) {
             
             callback(err,null) ;
          } else {
              
              callback(null,rowCount);
            }
        }); 

         if (insert) {

              request.addParameter('oper', TYPES.Int,data.operatorid);   
              request.addParameter('denom', TYPES.Int,data.denom);   
         }
         request.addParameter('unitid', TYPES.Int,data.unit);
         request.addParameter('propid', TYPES.Int,data.propid);
         request.addParameter('item', TYPES.NVarChar,item);
         request.addParameter('amount', TYPES.Int, amount);
         request.addParameter('date', TYPES.DateTime,new Date());

         connection.execSql(request);
    }


    });

};







function UpdateTotalOutMeter(connection,data,item,amount,callback) {

    var sql = '';
    var insert;

    CheckOnlineMeters(connection,data,function(err,results) {

    if (err)  {
         callback(err,null);
    } else {

         if(results > 0) {
             //update
             insert = false;
             sql = 'update db_LTDMeters set meterAmount = meterAmount + @amount,updated = @date where unitId = @unitid and unitPropId = @prop ' +
                   'and itemId = @item';
         } else {
             //insert
             insert = true;
             sql = 'insert into db_LTDMeters(unitId,unitPropId,itemId,meterAmount,updated,denom,operatorId)values(@unitid,@prop,' +
                   '@amount,@date,@oper)';
         }

         var request = new Request(sql,function(err,rowCount) {
         if(err) {
             
             callback(err,null) ;
          } else {
              
              callback(null,rowCount);
            }
        }); 

         if (insert) {

              request.addParameter('oper', TYPES.Int,data.operatorid);   
              request.addParameter('denom', TYPES.Int,data.denom);   
         }
         request.addParameter('unitid', TYPES.Int,data.unit);
         request.addParameter('propid', TYPES.Int,data.propid);
         request.addParameter('item', TYPES.NVarChar,item);
         request.addParameter('amount', TYPES.Int, amount);
         request.addParameter('date', TYPES.DateTime,new Date());

         connection.execSql(request);
    }


    });

};



function CheckLtdMeters(connection,data,callback) {

    var sql = 'select unitPropId from db_LTDMeters where unitId = @unitid and itemId = @itemid and denom = @denom ' +
              'and unitPropid = @propid';

    var request = new Request(sql,function(err,rowCount) {
    	if (err) {

    		callback(err,null);
    	} else {
             
    		callback(null,rowCount);
    	}

    });          

        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('itemid', TYPES.NVarChar,data.item);
        request.addParameter('denom', TYPES.Int,data.denom);
        request.addParameter('propid', TYPES.Int,data.propid);
        
        connection.execSql(request);

};



function WriteLTDMeter( connection,data,amount,callback) {

};



function UpdateLTDMeters(data,callback){

    var sql = '';
    var insert = false;
    var ccr = false;
    var value = data.denom * data.quantity;
    var connection;


    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    
    if (err) {
        callback(err,null);
    } else {

    connection = results;
    if(data.item === 'HP') {
 
         value = data.amount;
    } else if( data.item === 'VT1' || data.item === 'VT2' || data.item === 'VC1' || data.item === 'VC2') {

          value = data.amount;
          UpdateTotalInMeter(connection,data,'TI',data.amount,function(err,results) {

          });

    } else {
        if(data.item != 'CCR') {
          UpdateTotalOutMeter(connection,data,'TO',data.amount,function(err,results) {
          
          });
        }  else {
            UpdateTotalOutMeter(connection,data,'TO',-data.amount,function(err,results) {

            });
        }  
    }

  }


  });


} exports.UpdateLTDMeters = UpdateLTDMeters
;



//End LTD meters 