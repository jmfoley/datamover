var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';


function callback(error,results){};

function CheckTicketMeters(connection,data,callback) {

    var sql = 'select count(*) from ticketmeters where mach_num = @mach and propid = @prop ' +
              'and unitPropid = @propid';

    var request = new Request(sql,function(err,rowCount) {
    	if (err) {
            sql = null;
            delete request;
            errMsg = 'CheckTicketMeters error: '  + err;
    		callback(errMsg,null);
    	} else {
             sql = null;
             delete request;
    		callback(null,rowCount);
    	}

    });          


        request.addParameter('mach', TYPES.Int,data.machnum);
        request.addParameter('propid', TYPES.Int,data.propid);
        
        connection.execSql(request);

};


function UpdateTicketMeters(data,callback){

    var sql = '';
    var connection;
    var insert;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    	if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

    	} else {
    		connection = results;
    		CheckTicketMeters(connection,data,function(err,results) {
    			if (err) {
    				callback(err,null);
    			} else {
    				if (results > 0) {
    					sql = 'update ticketmeters set redeemcashable_ct = @rcashct,redeemcashable_amt = @rcashamt,redeempromo_ct = ' +
    					      '@rpromoct,redeempromo_amt = @rpromoamt,printedcashable_ct = @pcashct,printedcashable_amt = @pcashamt,' +
    					      'printedpromo_ct = @ppromoct,printedpromo_amt = @ppromoamt,updated = @date,machpaidexternbonus = ' +
    					      '@machextbonus,attpaidexternbonus = @attpaidextbonus,machpaidprogbonus = @machprogbonus,slot_id = @slotid ' +
    					      'where mach_num = @mach and propid = @propid';
    				} else {
    					insert = true;
    					sql = 'insert into ticketmeters(operatorId,slot_id,mach_num,redeemcashable_ct,redeemcashable_amt,redeempromo_ct' +
    						  'redeempromo_amt,printedcashable_ct,printedcashable_amt,printedpromo_ct,printedpromo_amt,updated,machpaidexternbonus,' +
    						  'attpaidexternbonus,machpaidprogbonus,propid)values(@oper,@slotid,@mach,@rcashct,@rcashamt,' +
    						  '@rpromoct,@rpromoamt,@pcashct,@pcashamt,@ppromoct,@ppromoamt,@date,@machextbonus,@attpaidextbonus,@machprogbonus,' +
    						  '@propid)';
    				}

                   var request = new Request(sql,function(err,rowCount) {
                   	 if (insert) {
                   	 	request.addParameter('oper', TYPES.Int,data.operatorid);
                   	 }
               	 	request.addParameter('id', TYPES.Int,data.id);                   	 
               	 	request.addParameter('mach', TYPES.Int,data.mach);
               	 	request.addParameter('rcashct', TYPES.Int,data.redcashct);
               	 	request.addParameter('rcashamt', TYPES.Int,data.redcashamt);
               	 	request.addParameter('rpromoct', TYPES.Int,data.redpromoct);
               	 	request.addParameter('rpromoamt', TYPES.Int,data.redpromoamt);
               	 	request.addParameter('pcashct', TYPES.Int,data.printedcashct);
               	 	request.addParameter('pcashamt', TYPES.Int,data.printedcashamt);
               	 	request.addParameter('ppromoct', TYPES.Int,data.printedpromoct);
               	 	request.addParameter('ppromoamt', TYPES.Int,data.printedpromoamt);
               	 	request.addParameter('date', TYPES.DateTime,new Date());
          	 		request.addParameter('machextbonus', TYPES.Int,data.machextbonus);
          	 		request.addParameter('attpaidextbonus', TYPES.Int,data.attextbonus);
          	 		request.addParameter('machprogbonus', TYPES.Int,data.machprogbonus);
          	 		request.addParameter('attprogbonus', TYPES.Int,data.attprogbonus);
                   
                    connection.execSql(request);

                   });
    			}
    		});

    	}
    });

} exports.UpdateTicketMeters = UpdateTicketMeters;