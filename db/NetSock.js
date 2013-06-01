var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';


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
            request.addParameter('oper', TYPES.Int, data.operatorid);
            request.addParameter('mach', TYPES.Int,data.mach);
            request.addParameter('slotid', TYPES.Int,data.slotid);
            request.addParameter('status', TYPES.VarChar,data.status);
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