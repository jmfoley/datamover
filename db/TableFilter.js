var KioskEvents = require('./Events')
var KioskMeters = require('./Meters')



function callback(error,results){};


function ProcessTrans(data,callback){

    if(data.table === 'db_unitevents') {
 	    KioskEvents.WriteKioskEvent(data,function(err,results){
 		    if(err){
 			    console.log('WriteEvents error: ' + err);
 		    } else{
 			    console.log('Event written');
 		    }

 	    });
     } else if ( data.table === 'db_onlinemeters') {
 	    KioskMeters.UpdateOnlineMeters(data,function(err,results){
 		    if(err){
 			    console.log('Update Online Meters error: ' + err);
 		    } else{
 			    console.log('Online meters written');
 		    }

 	    });
      

    
     }
    
} exports.ProcessTrans = ProcessTrans
;