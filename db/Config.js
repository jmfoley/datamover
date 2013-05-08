var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';

function callback(error,results){};



function DeleteBillbreakConfig( data,callback ) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
            errMsg = 'DeleteBillbreakConfig error: ' + err;
            callback(errMsg,null);
        } else {
            connection = results;
            sql = 'delete from sc_billBreaks where billdenom = @denom and propId = @prop and operatorID = @oper';

            var request = new Request(sql,function(err,results){

                if (err) {
                    errMsg = 'DeleteBillbreakConfig error: ' + err;
                    callback(errMsg,null);
                } else {
                    connection.close();
                    callback(err,results);
                }

            });
            request.addParameter('denom',TYPES.Int,data.denom);
            request.addParameter('prop',TYPES.Int,data.propid);
            request.addParameter('oper',TYPES.Int,data.operatorid);

            connection.execSql(request);


        }


    });



}exports.DeleteBillbreakConfig = DeleteBillbreakConfig
;

function UpdateBillbreakConfig(data,callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
            errMsg = 'UpdateBillbreakConfig error: ' + err;
            callback(errMsg,null);
        } else {
            connection = results;
            sql = 'update sc_billbreaks set bill1 = @bill1,bill2 = @bill2,bill5 = @bill5, bill10 = @bill10,bill20 = @bill20,' +
                  'bill50 = @bill50,bill100 = @bill100 where billDenom = @denom and propId = @propid and operatorID = @oper ' +
                  'updated = @date';

            var request = new Request(sql,function(err,results) {

                if (err) {
                    errMsg = 'UpdateBillbreakConfig error: ' + err;
                    callback(errMsg,null);
                } else {
                    connection.close();
                    callback(err,results);
                }


            });

            request.addParameter('denom',TYPES.Int,data.denom);
            request.addParameter('bill1',TYPES.Int,data.bill1);
            request.addParameter('bill2',TYPES.Int,data.bill2);
            request.addParameter('bill5',TYPES.Int,data.bill5);
            request.addParameter('bill10',TYPES.Int,data.bill10);
            request.addParameter('bill20',TYPES.Int,data.bill20);
            request.addParameter('bill50',TYPES.Int,data.bill50);
            request.addParameter('bill100',TYPES.Int,data.bill100);
            request.addParameter('prop',TYPES.Int,data.propid);
            request.addParameter('date',TYPES.DateTime,new Date());
            request.addParameter('oper',TYPES.Int,data.operatorid);

            connection.execSql(request);


        }


    });    

}exports.UpdateBillbreakConfig = UpdateBillbreakConfig
;


function AddBillbreakConfig(data,callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
            errMsg = 'AddBillbreakConfig error: ' + err;
            callback(errMsg,null);
        } else {
            connection = results;
            sql = 'insert into sc_billbreaks(billDenom,bill1,bill2,bill5,bill10,bill20,bill50,bill100,propid,updated,operatorID)values(' +
                  '@denom,@bill1,@bill2,@bill5,@bill10,@bill20,@bill50,@bill100,@prop,@date,@oper)';

            var request = new Request(sql,function(err,results) {

                if (err) {
                    errMsg = 'AddBillbreakConfig error: ' + err;
                    callback(errMsg,null);
                } else {
                    connection.close();
                    callback(err,results);
                }

            });

            request.addParameter('denom',TYPES.Int,data.denom);
            request.addParameter('bill1',TYPES.Int,data.bill1);
            request.addParameter('bill2',TYPES.Int,data.bill2);
            request.addParameter('bill5',TYPES.Int,data.bill5);
            request.addParameter('bill10',TYPES.Int,data.bill10);
            request.addParameter('bill20',TYPES.Int,data.bill20);
            request.addParameter('bill50',TYPES.Int,data.bill50);
            request.addParameter('bill100',TYPES.Int,data.bill100);
            request.addParameter('prop',TYPES.Int,data.propid);
            request.addParameter('date',TYPES.DateTime,new Date());
            request.addParameter('oper',TYPES.Int,data.operatorid);

            connection.execSql(request);

        }
    });


}exports.AddBillbreakConfig = AddBillbreakConfig
;


function UpdateCreditCardOption(data,callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
             errMsg = 'GetDbConnection error: ' + err;
             callback(errMsg,null);

        } else {
   
            connection = results;
            sql = 'update sc_units set creditCard = @credit, updated = @date where unitId = @unitid and unitPropid = @prop';

            var request = new Request(sql,function(err,rowCount) {
        
        
            if(err){
                errMsg = 'UpdateCreditCardConfig error: ' + err;
                connection.close();
                callback(errMsg,null);
            
            } else{
                connection.close();
                callback(null,connection);
            
            }


        });

        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('prop', TYPES.Int,data.propid);
        request.addParameter('credit', TYPES.Int,data.credit);
        request.addParameter('date', TYPES.DateTime,new Date());
        
        connection.execSql(request);

        }
    });



} exports.UpdateCreditCardOption = UpdateCreditCardOption
;




function UpdateAppVersion(data,callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
             errMsg = 'GetDbConnection error: ' + err;
             callback(errMsg,null);

        } else {
   
            connection = results;
            sql = 'update sc_units set appVersion = @app, updated = @date where unitId = @unitid and unitPropid = @prop';

            var request = new Request(sql,function(err,rowCount) {
        
        
            if(err){
                errMsg = 'UpdateAppVersion error: ' + err;
                connection.close();
                callback(errMsg,null);
            
            } else{
                connection.close();
                callback(null,connection);
            
            }


        });

        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('prop', TYPES.Int,data.propid);
        request.addParameter('app', TYPES.VarChar,data.app);
        request.addParameter('date', TYPES.DateTime,new Date());
        
        connection.execSql(request);

        }
    });



} exports.UpdateAppVersion = UpdateAppVersion
;


function DeleteUnitDevice(data, callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
             errMsg = 'GetDbConnection error: ' + err;
             callback(errMsg,null);

        } else {
   
            connection = results;
            sql = 'delete from sc_deviceConfig where unitId = @unitid and unitPropId = @prop and deviceId = @device';

            var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
                errMsg = 'DeleteUnitDevice error: ' + err;
                connection.close();
                callback(errMsg,null);
            
            } else{
                connection.close();
                callback(null,connection);
            
            }


        });

        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('prop', TYPES.Int,data.propid);
        request.addParameter('device', TYPES.Int,data.device);
        
        connection.execSql(request);





        }
    });


} exports.DeleteUnitDevice = DeleteUnitDevice
;



function UpdateUnitDevice(data, callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
             errMsg = 'GetDbConnection error: ' + err;
             callback(errMsg,null);

        } else {
   
            connection = results;
            sql = 'update sc_deviceConfig set port = @port, updated = @date where unitId = @unitid and unitPropid = @prop and ' +
                  'deviceId = @device';

            var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
                errMsg = 'UpdateUnitDeviceError: ' + err;
                connection.close();
                callback(errMsg,null);
            
            } else{
                connection.close();
                callback(null,connection);
            
            }


        });

        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('prop', TYPES.Int,data.propid);
        request.addParameter('device', TYPES.Int,data.device);
        request.addParameter('port', TYPES.VarChar,data.deviceport);
        request.addParameter('date', TYPES.DateTime,new Date());
        
        connection.execSql(request);





        }
    });


} exports.UpdateUnitDevice = UpdateUnitDevice
;







function InsertUnitDevice(data, callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
             errMsg = 'GetDbConnection error: ' + err;
             callback(errMsg,null);

        } else {
   
            connection = results;
            sql = 'insert into sc_deviceConfig(unitId,unitPropId,deviceId,port,updated,operatorId)values(@unitid,@prop,' +
                  '@device,@port,@date,@oper)';

            var request = new Request(sql,function(err,rowCount) {
        
        
            if(err){
                errMsg = 'InsertUNitDevice error: ' + err;
                connection.close();
                callback(errMsg,null);
            
            } else{
                connection.close();
                callback(null,connection);
            
            }


        });

        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('prop', TYPES.Int,data.propid);
        request.addParameter('device', TYPES.Int,data.device);
        request.addParameter('port', TYPES.VarChar,data.deviceport);
        request.addParameter('date', TYPES.DateTime,new Date());
        request.addParameter('oper', TYPES.Int,data.operatorid);
        
        connection.execSql(request);





        }
    });


} exports.InsertUnitDevice = InsertUnitDevice
;



function DeleteUnitDenomConfig(data,callback) {
    
    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

        } else {

            connection = results;
            sql = 'delete from sc_unitconfig where unitId = @unitid and unitPropId = @prop';

            var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
                errMsg = 'DeleteUnitDenomConfig error: ' + err;
                connection.close();
                callback(errMsg,null);
            
            } else {
                connection.close();
                callback(null,connection);
            
            }


          });

        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('prop', TYPES.Int,data.propid);
        
        connection.execSql(request);


        }

    });



} exports.DeleteUnitDenomConfig = DeleteUnitDenomConfig
;

function UpdateDenomConfig(data,callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

        } else {

            connection = results;
            sql = 'insert into sc_unitConfig(unitId,unitPropId,itemId,denom,updated,operatorId)values(@unitid,@prop,@item,@denom,@date,@oper)';

            var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
                errMsg = 'DeleteUnitDenomConfig error: ' + err;
                connection.close();
                callback(errMsg,null);
            
            } else{
                connection.close();
                callback(null,connection);
            
            }


          });


        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('prop', TYPES.Int,data.propid);
        request.addParameter('item', TYPES.VarChar,data.item);
        request.addParameter('denom', TYPES.Int,data.denom);
        request.addParameter('date', TYPES.DateTime,new Date());
        request.addParameter('oper', TYPES.Int,data.operatorid);

        connection.execSql(request);

        }

    });

} exports.UpdateDenomConfig = UpdateDenomConfig
;



function UpdateKioskUnit(data,callback) {

    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
        	callback(errMsg,null);

        } else {
            console.log("Ticket Redeem = : " + data.ticketredeem);
            console.log("Bill Break = : " + data.billbreak);
            connection = results;
            sql = 'update sc_units set unitName = @unitname,unitStatus = @unitstatus,unitType = @unittype,billBreak = @billbreak,' +
                  'ticketRedeem = @ticketredeem,playersClub = @playersclub,ATM = @atm,checkCash = @checkcash,cashAdvance = @cashadvance,' +
                  'updatedBy = @updatedby,updated = @date,updatedFrom = @updatedfrom,terminalId = @terminalid,sasPort = @sasport,' +
                  'numBV = @numbv,numCC = @numcc,numCH = @numch,SASAddress = @sasaddress,licenseNum = @lic where unitId = @unitid and ' +
                  'unitPropId = @prop';


	        var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
                errMsg = 'UpdateKioskUnit error: ' + err;
        	    connection.close();
        	    callback(errMsg,null);
        	
            } else{
        	    connection.close();
        	    callback(null,connection);
        	
            }


       	  });

      
        request.addParameter('unitname', TYPES.VarChar,data.unitname);
        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('prop', TYPES.Int,data.propid);
        request.addParameter('unitstatus', TYPES.Int,data.unitstatus);
        request.addParameter('unittype', TYPES.Int,data.unittype);
        request.addParameter('billbreak', TYPES.Int,data.billbreak);
        request.addParameter('ticketredeem', TYPES.Int,data.ticketredeem);
        request.addParameter('playersclub', TYPES.Int,data.playersclub);
        request.addParameter('atm', TYPES.Int,data.atm);
        request.addParameter('checkcash', TYPES.Int,data.checkcash);
        request.addParameter('cashadvance', TYPES.Int,data.cashadvance);
        request.addParameter('updatedby', TYPES.VarChar, data.updatedby);
        request.addParameter('date', TYPES.DateTime, new Date());
        request.addParameter('updatedfrom', TYPES.VarChar,data.updatedfrom);
        request.addParameter('terminalid', TYPES.UniqueIdentifierN,data.terminalid);
        request.addParameter('sasport', TYPES.VarChar,data.sasport);
        request.addParameter('numbv', TYPES.Int,data.numbv);
        request.addParameter('numcc', TYPES.Int,data.numcc);
        request.addParameter('numch', TYPES.Int,data.numch);
        request.addParameter('sasaddress', TYPES.VarChar,data.sasaddress);
        request.addParameter('lic', TYPES.VarChar,data.license);

        connection.execSql(request);

          

        }
    });


} exports.UpdateKioskUnit = UpdateKioskUnit
;