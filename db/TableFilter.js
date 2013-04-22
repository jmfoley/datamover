var KioskEvents = require('./Events')
var KioskMeters = require('./Meters')
var atm = require('./atm');



function callback(error,results){};


function ProcessTrans(data,callback){

    if(data.table === 'db_unitevents') {
 	    KioskEvents.WriteKioskEvent(data,function(err,results){
 		    if (err) {
 			    console.log('WriteEvents error: ' + err);
 			    callback(err,null);
 		    } else {
 			    console.log('Event written');
 			    callback(null,results);
 		    }

 	    });
     } else if ( data.table === 'db_onlinemeters') {
 	    KioskMeters.UpdateOnlineMeters(data,function(err,results){
 		    if (err) {
 			    console.log('Update Online Meters error: ' + err);
 			    callback(err,null);
 		    } else {
 			    console.log('Online meters written');
 			    callback(null,results);
 		    }

 	    });
      

    
     } else if (data.table === 'db_atmTrans') {

         atm.WriteAtmTrans(data,function(err,results) {
         
             if (err) {
             	console.log('WriteAtmTrans error: ' + err);
             	callback(err,null);
             } else {
             	 console.log('atm trans written');
             	 callback(null,results);
             }
         });
     } else if (data.table === 'db_unitTransMeters') {
     	KioskMeters.WriteOnlineMeterSnapshot(data,function(err,results) {

             if (err) {
             	console.log('WriteOnlineMeterSnapshot error: ' + err);
             	callback(err,null);
             } else {
             	 console.log('WriteOnlineMeterSnapshot written');
             	 callback(null,results);
             }



     	});
     }
    
} exports.ProcessTrans = ProcessTrans
;