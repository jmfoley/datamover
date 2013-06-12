var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';




function RemoveMachineEftMeters(connection,data,callback) {
    var sql = 'update eftmeters set slot_id = 0 where mach_num = @mach and propid = @propid';

    var request = new Request(sql,function(err,results) {
        if (err) {
            errMsg = 'RemoveMachine error: '  + err;
            sql = null;
            delete request;
            callback(errMsg,null);

        } else {
           sql = null;
           delete request;
           callback(null,results);

        }       
    });
    request.addParameter('mach', TYPES.Int,data.mach);        
    request.addParameter('propid', TYPES.Int,data.propid);

    connection.execSql(request);

};


function RemoveMachineTicketMeters(connection,data,callback) {
    var sql = 'update ticketmeters set slot_id = 0 where mach_num = @mach and propid = @propid';

    var request = new Request(sql,function(err,results) {
        if (err) {
            errMsg = 'RemoveMachineTicketMeters error: '  + err;
            sql = null;
            delete request;
            callback(errMsg,null);

        } else {
           sql = null;
           delete request;
           callback(null,results);

        }       
    });
    request.addParameter('mach', TYPES.Int,data.mach);        
    request.addParameter('propid', TYPES.Int,data.propid);

    connection.execSql(request);

};


function RemoveMachineDenomMeters(connection,data,callback) {
    var sql = 'update db_denommeters set onlineid = 0 where machineNumber = @mach and propid = @propid';

    var request = new Request(sql,function(err,results) {
        if (err) {
            errMsg = 'RemoveMachineDenomMeters error: '  + err;
            sql = null;
            delete request;
            callback(errMsg,null);

        } else {
           sql = null;
           delete request;
           callback(null,results);

        }       
    });
    request.addParameter('mach', TYPES.Int,data.mach);        
    request.addParameter('propid', TYPES.Int,data.propid);

    connection.execSql(request);

};


function RemoveMachineMultiGameMeters(connection,data,callback) {
    var sql = 'update db_denommeters set onlineid = 0 where machineNumber = @mach and propid = @propid';

    var request = new Request(sql,function(err,results) {
        if (err) {
            errMsg = 'RemoveMachineMultiGameMeters error: '  + err;
            sql = null;
            delete request;
            callback(errMsg,null);

        } else {
           sql = null;
           delete request;
           callback(null,results);

        }       
    });
    request.addParameter('mach', TYPES.Int,data.mach);        
    request.addParameter('propid', TYPES.Int,data.propid);

    connection.execSql(request);

};


function RemoveMachine( data, callback) {
    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

        } else {
            connection = results;
            sql = 'update slots set slot_id = @id, netsock_id_hex = @nethex, netsock_ip = @ip, ' +
                  'netsock_slot_id = 0, status = @status,netsock_id_dec = 0,boardaddress = 0,' +
                  'loc_id = 0, position = 0,updated = @date where mach_num = @mach and propid = ' +
                  '@propid';

            var request = new Request(sql,function(err,results) {
                if (err) {
                    errMsg = 'RemoveMachine error: '  + err;
                    connection.close();
                    connection = null;
                    sql = null;
                    delete request;
                    callback(errMsg,null);

                } else {
                   RemoveMachineEftMeters(connection,data, function(err,results) {
                      if (err) {
                         connection.close();
                         connection = null;
                         sql = null;
                         callback(err,null);
                         delete request;
                       } else {
                           RemoveMachineTicketMeters(connection,data,function(err,results) {
                              if (err) {
                                 connection.close();
                                 connection = null;
                                 sql = null;
                                 callback(err,null);
                                 delete request;
                               } else {
                                  RemoveMachineDenomMeters(connection,data,function(err,results) {
                                      if (err) {
                                         connection.close();
                                         connection = null;
                                         sql = null;
                                         callback(err,null);
                                         delete request;
                                       } else {
                                          RemoveMachineMultiGameMeters(connection,data,function(err,results) {
                                              if (err) {
                                                 connection.close();
                                                 connection = null;
                                                 sql = null;
                                                 callback(err,null);
                                             } else {
                                               connection.close();
                                               connection = null;
                                               sql = null;
                                               delete request;
                                               callback(null,results);
  
                                             }

                                          });
                                       }

                                  }); 
                               }
      
                           });                           
                       }
                   });

                }
            });
            request.addParameter('mach', TYPES.Int,data.mach);
            request.addParameter('id', TYPES.Int,data.slotid);
            request.addParameter('date', TYPES.DateTime,new Date());
            request.addParameter('propid', TYPES.Int,data.propid);
            request.addParameter('nethex', TYPES.VarChar,'');
            request.addParameter('ip', TYPES.VarChar,'');
            request.addParameter('status', TYPES.VarChar,'INACTIVE');

            connection.execSql(request);


        }

    });

}exports.RemoveMachine = RemoveMachine;


function EditMachine( data,callback) {

  var sql = '';
  var connection;
  var updated = new Date();

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

        } else {
           connection = results;
           sql = 'update slots set slot_id = @SlotId, ' +
                 'mach_denom = (select denom from sl_type where type_id = @TypeId), mach_par = (select mach_par from sl_type where type_id = @TypeId), manuf_theor_par = (select manuf_theor_par from sl_type where type_id = @TypeId), ' +
                 'type_id = @TypeId, style_id = @StyleId, ' +
                 'status = @Status, statusdate = @date, status_by = @UserID, ' +
                 'point_factor = (select point_factor from sl_type where type_id = @TypeId), ' +
                 'userid = @UserID, updated = @date, subtractforecast = (select subtractforecast from sl_type where type_id = @TypeId), ' +                 
                 'serial_id = @serialId, model_id = @modelId, licenseNum = @licenseNum ' +                 
                 ' where mach_num = @MachNum and propid = @propid';

            var request = new Request(sql,function(err,results) {                 
                if (err) {
                    errMsg = 'EditMachine error: '  + err;
                    connection.close();
                    connection = null;
                    sql = null;
                    delete request;
                    delete updated;
                    callback(errMsg,null);

                } else {

                   connection.close();
                   connection = null;
                   sql = null;
                   delete request;
                   delete updated;
                   callback(null,results);

                }

            });

            request.addParameter('MachNum', TYPES.Int,data.mach);
            request.addParameter('SlotId', TYPES.Int,data.slotid);
            request.addParameter('TypeId', TYPES.VarChar,data.typeid);
            request.addParameter('StyleId', TYPES.VarChar, data.styleid);
            request.addParameter('Status', TYPES.VarChar,data.status);
            request.addParameter('WorkStation', TYPES.VarChar,data.workstation);
            request.addParameter('UserID', TYPES.VarChar,data.userid);
            request.addParameter('serialId', TYPES.VarChar,data.serialid);
            request.addParameter('modelId', TYPES.VarChar,data.modelid);
            request.addParameter('licenseNum', TYPES.VarChar,data.licnum);
            request.addParameter('propid', TYPES.Int,data.propid);
            request.addParameter('date', TYPES.DateTime,updated);


            connection.execSql(request);
            


        }

   });


}exports.EditMachine = EditMachine;




function AddMachine(data,callback) {
	var sql = '';
	var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

        } else {
        	connection = results;
        	sql = 'insert into slots(operatorid,mach_num,slot_id,netsock_slot_id,status,' +
        		  'date_on_floor,basedenom,boardaddress,machparonline,netsock_id_dec,updated,' +
        		  'propid)values(@oper,@mach,@slotid,@slotid,@status,@dateonfloor,@denom,' +
        		  '@addr,@par,@id,@date,@propid)';

            var request = new Request(sql,function(err,results) {
                if (err) {
                    errMsg = 'AddMachine error: '  + err;
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
            request.addParameter('mach', TYPES.Int,data.mach);
            request.addParameter('slotid', TYPES.Int,data.slotid);
            request.addParameter('status', TYPES.VarChar,data.status);
            request.addParameter('oper', TYPES.Int, data.operatorid);
            request.addParameter('dateonfloor', TYPES.DateTime,new Date(data.dateonfloor));
            request.addParameter('denom', TYPES.Int,data.denom);
            request.addParameter('addr', TYPES.Int,data.addr);
            request.addParameter('par', TYPES.Int,data.par);
            request.addParameter('id', TYPES.Int,data.netsockid);
            request.addParameter('date', TYPES.DateTime,new Date());
            request.addParameter('propid', TYPES.Int,data.propid);




            connection.execSql(request);



        }
    });


}exports.AddMachine = AddMachine;