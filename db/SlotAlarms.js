var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')


function callback(error,results){};

function WriteSlotAlarm(data,callback){
	var sql = '';
	var connection;

	dbConnect.GetDbConnection(data.operatorid,function(err,results) {
      if(err){
        errMsg = 'GetDbConnection error: ' + err;
        callback(errMsg,null);
       } else {		
       	  connection = results;
       	  sql = 'insert into sl_alarms(operatorID,propid,slot_id,alarm_code,alarm_priority,i_card,casinoid,initiated_time,initiated_date,ol_bill_1,' +
       	  	    'ol_bill_2,ol_bill_5,ol_bill_10,ol_bill_20,ol_bill_50,ol_bill_100,ol_coin_in,ol_coin_out,ol_coin_drop,' +
       	  	    'ol_coin_games,ol_jackpot,ol_cancel_credit,ref_alarm_code,amount,alarm_id)values(@oper,@prop,@id,@code,@priority,@card,@casinoid,' +
       	  	    '@time,@date,@olbill1,@olbill2,@olbill5,@olbill10,@olbill20,@olbill50,@olbill100,@olcoinin,@olcoinout,@olcoindrop,' +
       	  	    '@olcoingames,@oljackpot,@olcancelcredit,@refalarm,@amount,@alarmid)';

	      var request = new Request(sql,function(err,results) {
            if (err) {
                errMsg = 'WriteSlotAlarm error: '  + err;
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

            request.addParameter('oper', TYPES.Int,data.operatorid);
            request.addParameter('prop', TYPES.Int,data.propid);
            request.addParameter('id', TYPES.Int,data.id);
            request.addParameter('code', TYPES.Int,data.code);
            request.addParameter('priority', TYPES.Int,data.priority);
            request.addParameter('card', TYPES.Int,data.card);
            request.addParameter('casinoid', TYPES.Int,data.casinoid);
            request.addParameter('time', TYPES.VarChar,data.time);
            request.addParameter('date', TYPES.VarChar,data.date);
            request.addParameter('olbill1', TYPES.Int,data.olbill1);
            request.addParameter('olbill2', TYPES.Int,data.olbill2);
            request.addParameter('olbill5', TYPES.Int,data.olbill5);
            request.addParameter('olbill10', TYPES.Int,data.olbill10);
            request.addParameter('olbill20', TYPES.Int,data.olbill20);
            request.addParameter('olbill50', TYPES.Int,data.olbill50);
            request.addParameter('olbill100', TYPES.Int,data.olbill100);
            request.addParameter('olcoinin', TYPES.Int,data.olcoinin);
            request.addParameter('olcoinout', TYPES.Int,data.olcoinout);
            request.addParameter('olcoindrop', TYPES.Int,data.olcoindrop);
            request.addParameter('olcoingames', TYPES.Int,data.olcoingames);
            request.addParameter('oljackpot', TYPES.Int,data.oljackpot);
            request.addParameter('olcancelcredit', TYPES.Int,data.cancelcredit);
            request.addParameter('refalarm', TYPES.Int,data.refalarm);
            request.addParameter('amount', TYPES.Int,data.amount);
            request.addParameter('alarmid', TYPES.Int,data.alarmid);
            
            connection.execSql(request);


       }


	});



}exports.WriteSlotAlarm = WriteSlotAlarm;