var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';

function callback(error,results){};


function ZeroCoinHopper(data,callback){

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
         if(err){
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);
         } else {
             connection = results;
             sql = 'update db_onlinemeters set itemAmount = @amount,itemQty = @qty where unitId = @unitid and unitPropid = @propid and ' +
                   'itemId = @item';

             var request = new Request(sql,function(err,results) {

                if (err) {
                    errMsg = 'ZeroCoinHopper error: '  + err;
                    callback(errMsg,null);
                } else {
                     
                    callback(null,rowCount);
                }

            });

                request.addParameter('unitid', TYPES.Int,data.unit);
                request.addParameter('itemid', TYPES.NVarChar,data.item);
                request.addParameter('qty', TYPES.Int,0);
                request.addParameter('amount', TYPES.Int,0);
                request.addParameter('propid', TYPES.Int,data.propid);
                
                connection.execSql(request);

         }

    });


} exports.ZeroCoinHopper = ZeroCoinHopper
;



//Online meters
function CheckOnlineMeters(connection,data,callback) {

    var sql = 'select unitPropId from db_onlinemeters where unitId = @unitid and itemId = @itemid and denom = @denom ' +
              'and unitPropid = @propid';

    var request = new Request(sql,function(err,rowCount) {
    	if (err) {
            errMsg = 'CheckOnlineMeters error: '  + err;
    		callback(errMsg,null);
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
            errMsg = 'GetDbConnection error: ' + err;
         	callback(errMsg,null);
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
                          if (err) {
                              errMsg = 'UpdateOnlineMeters error: ' + err;
                              connection.close();
                          	  callback(errMsg,null) ;
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
             sql = 'update db_LTDMeters set meterAmount = meterAmount + @amount,updated = @date where unitId = @unitid and unitPropId = @propid ' +
                   'and itemId = @item';
         } else {
             //insert
             insert = true;
             sql = 'insert into db_LTDMeters(unitId,unitPropId,itemId,meterAmount,updated,denom,operatorId)values(@unitid,@propid,' +
                   '@amount,@date,@oper)';
         }

         var request = new Request(sql,function(err,rowCount) {
         if(err) {
             errMsg = 'UpdateTotalInMeter error: ' + err;
             callback(errMsg,null) ;
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
             sql = 'update db_LTDMeters set meterAmount = meterAmount + @amount,updated = @date where unitId = @unitid and unitPropId = @propid ' +
                   'and itemId = @item';
         } else {
             //insert
             insert = true;
             sql = 'insert into db_LTDMeters(unitId,unitPropId,itemId,meterAmount,updated,denom,operatorId)values(@unitid,@propid,' +
                   '@amount,@date,@oper)';
         }

         var request = new Request(sql,function(err,rowCount) {
         if(err) {
             errMsg = 'GetDbConnection error: ' + err;
             callback(errMsg,null) ;
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



function WriteLTDMeter( connection,data,callback) {
    var sql= '';
    var insert;

    CheckLtdMeters(connection,data,function(err,results) {
        if (err) {
            callback(err,results);
        } else {

         if (results > 0) {
            insert = false;

            if(data.item != 'CCR') {
                sql = 'update db_LTDMeters set meterAmount = meterAmount + @amount,updated = @date where unitId = @unitid and ' +
                      'unitPropId = @propid and itemId = @item and denom = @denom';

            }
            else {
                sql = 'update db_LTDMeters set meterAmount = meterAmount - @amount,updated = @date where unitId = @unitid and ' +
                      'unitPropId = @propid and itemId = @item and denom = @denom';

            }
         } else {
            insert = true;
            sql = 'insert into db_LTDMeters(unitId,unitPropId,itemId,meterAmount,updated,denom,operatorId)values(@unitid,@propid,' +
                  '@item,@amount,@date,@denom,@oper)';
         }

            var request = new Request(sql,function(err,rowCount) {
                if (err) {

                    callback(err,null);
                } else {
                     
                    callback(null,rowCount);
                }
            });

            request.addParameter('unitid', TYPES.Int,data.unit);
            request.addParameter('item', TYPES.NVarChar,data.item);
            request.addParameter('denom', TYPES.Int,data.denom);
            request.addParameter('propid', TYPES.Int,data.propid);
            request.addParameter('amount', TYPES.Int,data.amount);
            request.addParameter('date', TYPES.DateTime,new Date());
            if (insert) {
                request.addParameter('oper', TYPES.Int,data.operatorid);
            }

            
            connection.execSql(request);


        }

    });
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
             if ( err ) {

                connection.close();
                callback(err,null);
             } else {

                WriteLTDMeter(connection,data,function(err,results) {

                    if (err) {
                        connection.close();
                        callback(err,null);
                    } else {
                        connection.close();
                        callback(null,results);
                    }
                });
             }
          //}
       });

    } else {
        if(data.item != 'CCR') {
          UpdateTotalOutMeter(connection,data,'TO',data.amount,function(err,results) {
            if (err) {
                connection.close();
                callback(err,null);

            } else {
                WriteLTDMeter(connection,data,function(err,results){
                    if (err) {
                        connection.close();
                        callback(err,null);
                    } else {
                        connection.close();
                        callback(null,results);
                    }

                });
            }
          
          });
        }  else {
            UpdateTotalOutMeter(connection,data,'TO',-data.amount,function(err,results) {
                if (err) {
                    connection.close();
                    callback(err,null);
                } else {
                    WriteLTDMeter(connection,data,function(err,results) {
                    
                        if (err) {
                            connection.close();
                            callback(err,null);
                        } else {
                            connection.close();
                            callback(null,results);
                        }
                    });
                }

            });
        }  
    }

  }


  });


} exports.UpdateLTDMeters = UpdateLTDMeters
;



//End LTD meters 


//Begin Kents meter funciton


function WriteOnlineMeterSnapshot(data,callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);
        } else {
            connection = results;
            sql = 'insert into db_unitTransMeters(operatorID,unitId, unitPropId,transNumber,vc1,vc2,vt1,vt2,cc1,cc2,cc3,cc4,cc5,'  +
                  'ch1,ch2,ch3,ccr,updated,atm,hpt,mtr,tcd,tdt,tft)values(@oper,@unitid,@propid,@trans,@vc1,@vc2,@vt1,@vt2,@cc1,@cc2,@cc3,@cc4,@cc5,' +
                  '@ch1,@ch2,@ch3,@ccr,@date,@atm,@hpt,@mtr,@tcd,@tdt,@tft)';

            var request = new Request(sql,function(err,rowCount) {
            if(err) {
                errMsg = 'WriteOnlineMeterSnapshot error: ' + err;
                connection.close();
                callback(errMsg,null) ;
            } else {
                connection.close();
                callback(null,rowCount);
            }
         }); 

         request.addParameter('oper', TYPES.Int,data.operatorid);
         request.addParameter('unitid', TYPES.Int,data.unitid);
         request.addParameter('propid', TYPES.Int,data.propid);
         request.addParameter('trans', TYPES.Int,data.trans);
         request.addParameter('vc1', TYPES.Int,data.vc1);
         request.addParameter('vc2', TYPES.Int, data.vc2);
         request.addParameter('vt1', TYPES.Int,data.vt1);
         request.addParameter('vt2', TYPES.Int,data.vt2);
         request.addParameter('cc1', TYPES.Int,data.cc1);
         request.addParameter('cc2', TYPES.Int,data.cc2);
         request.addParameter('cc3', TYPES.Int,data.cc3);
         request.addParameter('cc4', TYPES.Int,data.cc4);
         request.addParameter('cc5', TYPES.Int,data.cc5);
         request.addParameter('ch1', TYPES.Int,data.ch1);
         request.addParameter('ch2', TYPES.Int,data.ch2);
         request.addParameter('ch3', TYPES.Int,data.ch2);
         request.addParameter('ccr', TYPES.Int,data.ccr);
         request.addParameter('date', TYPES.DateTime,new Date());
         request.addParameter('atm', TYPES.Int,data.atm);
         request.addParameter('hpt', TYPES.Int,data.hpt);
         request.addParameter('mtr', TYPES.Int,data.mtr);
         request.addParameter('tcd', TYPES.Int,data.tcd);
         request.addParameter('tdt', TYPES.Int,data.tdt);
         request.addParameter('tft', TYPES.Int,data.tft);


         connection.execSql(request);

        }

    });

} exports.WriteOnlineMeterSnapshot = WriteOnlineMeterSnapshot
;


//End Kents meter function


//Begin Occur meters 

function CheckSwitchMeter(connection,data,callback) {

    var sql = 'select meterValue from db_LtdOccurMeters where unitId = @unitid and eventId = @eventid ' +
              'and unitPropid = @propid';

    var request = new Request(sql,function(err,rowCount) {
      if (err) {
        errMsg = 'CheckSwitchMeter error: ' + err;
        callback(errMsg,null);
      } else {
             
        callback(null,rowCount);
      }

    });          

        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('eventid', TYPES.Int,data.eventid);
        request.addParameter('propid', TYPES.Int,data.propid);
        
        connection.execSql(request);

};


function UpdateDoorSwitchMeters(data,callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);
        } else {

            connection = results;
            CheckSwitchMeter(connection,data,function(err,results) {

                if (err) {
                    
                    connection.close();
                    callback(err,null);
                } else {
                    
                    if (results > 0) {

                        sql = 'update db_LtdOccurMeters set meterValue = meterValue + @value,updated = @date where unitId = @unitid and ' +
                              'unitPropid = @propid and eventId = @eventid and operatorid = @oper';
                    } else {

                       sql = 'insert into db_LtdOccurMeters(unitid,unitpropid,eventid,metervalue,updated,operatorid) values(@unitid,@propid,' +
                             '@eventid,@value,@date,@oper)';
                    }

                    var request = new Request(sql,function(err,rowCount) {

                         if (err) {
                             errMsg = 'UpdateDoorSwitchMeters error: ' + err;
                             connection.close();
                             callback(errMsg,null);
                         } else {
                             connection.close();
                             callback(null,rowCount);
                         }
                    });
                
                    
                     request.addParameter('unitid', TYPES.Int,data.unit);
                     request.addParameter('eventid', TYPES.Int,data.eventid);
                     request.addParameter('propid', TYPES.Int,data.propid);
                     request.addParameter('oper', TYPES.Int,data.operatorid);
                     request.addParameter('value', TYPES.Int,1);
                     request.addParameter('date', TYPES.DateTime,new Date());

        
                    connection.execSql(request);


                }

            });

        }


    });

} exports.UpdateDoorSwitchMeters = UpdateDoorSwitchMeters
;


//End Occur meters 