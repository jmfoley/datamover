var slotAlarms = require('./SlotAlarms');
var slotTicketMeters = require('./SlotTicketMeters');


function callback(error,results){};

function ProcessTrans(data,callback){
  if(data.table === 'sl_alarms') {
  	slotAlarms.WriteSlotAlarm(data,function(err,results) {
	    if (err) {
		    console.log('WriteEvents error: ' + err);
        Utils.LogError(data,err,function(err,results) {

        });

        data = null;
		    callback(err,null);
	    } else {
		    //console.log('Event written');
        data = null;
		    callback(null,results);
	    }

    });
  
  } else if (data.table === 'ticketmeters') {
     slotTicketMeters.UpdateTicketMeters(data,function(err,results) {
	    if (err) {
		    console.log('UpdateTicketMeters error: ' + err);
        Utils.LogError(data,err,function(err,results) {

        });

        data = null;
		    callback(err,null);
	    } else {
		    //console.log('Event written');
        data = null;
		    callback(null,results);
	    }



     });
  }

}exports.ProcessTrans = ProcessTrans;