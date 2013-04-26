var KioskEvents = require('./Events');
var KioskMeters = require('./Meters');
var atm = require('./atm');
var KioskTrans = require('./Transactions');
var KioskUnit = require('./Config');



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
     } else if (data.table === 'db_LtdOccurMeters') {

        KioskMeters.UpdateDoorSwitchMeters(data,function(err,results) {

             if (err) {
                console.log('UpdateDoorSwitchMeters error: ' + err);
                callback(err,null);
             } else {
                 console.log('UpdateDoorSwitchMeters written');
                 callback(null,results);
             }
 

        });
     } else if (data.table === 'db_unitTrans') {
       

          if(data.operation === 'initial_write') {

             KioskTrans.WriteKioskTrans(data,function(err,results) {

             if (err) {
                console.log('WriteKioskTrans error: ' + err);
                callback(err,null);
             } else {
                 console.log('WriteKioskTrans written');
                 callback(null,results);
             }

         });
      } else if (data.operation === 'complete') {
  
          KioskTrans.CompleteCurrentTrans(data,function(err,results) {

             if (err) {
                console.log('CompleteCurrentTrans error: ' + err);
                callback(err,null);
             } else {
                 console.log('CompleteCurrentTrans written');
                 callback(null,results);
             }

         });

      
      } else if (data.operation === 'pending_to_complete') {

          KioskTrans.SetPendingTransToComplete(data,function(err,results) {

             if (err) {
                console.log('SetPendingTransToComplete error: ' + err);
                callback(err,null);
             } else {
                 console.log('SetPendingTransToComplete written');
                 callback(null,results);
             }

         });



      }
   } else if (data.table === 'db_unitTransDetail') {

        KioskTrans.WriteUnitTransDetail(data,function(err,results) {
   
            if (err) {
                console.log('WriteUnitTransDetail error: ' + err);
                callback(err,null);

            } else {
                 console.log('WriteUnitTransDetail written');
                 callback(null,results);

            }

        });

   } else if (data.table === 'sc_units') {


       if(data.operation === 'update') {


           KioskUnit.UpdateKioskUnit(data,function(err,results) {

                if (err) {
                    console.log('UpdateKioskUnit error: ' + err);
                    callback(err,null);

                } else {
                     console.log('UpdateKioskUnit written');
                     callback(null,results);

                }

           });
       } else if(data.operation == 'update_app_version') {

           KioskUnit.UpdateAppVersion(data,function(err,results) {
  
              if (err) {
                    console.log('UpdateAppVersion error: ' + err);
                    callback(err,null);

                } else {
                     console.log('UpdateAppVersion written');
                     callback(null,results);

                }



           });
       } else if (data.operation === 'update_creditcard') {

           KioskUnit.UpdateCreditCardOption(data,function(err,results) {
  
              if (err) {
                    console.log('UpdateCreditCardOption error: ' + err);
                    callback(err,null);

                } else {
                     console.log('UpdateCreditCardOption written');
                     callback(null,results);

                }



           });
       }
   } else if (data.table === 'sc_unitConfig') {

        if(data.operation === 'delete') {

            KioskUnit.DeleteUnitDenomConfig(data,function(err,results) {

            if (err) {
                console.log('DeleteUnitDenomConfig error: ' + err);
                callback(err,null);

            } else {
                 console.log('DeleteUnitDenomConfig written');
                 callback(null,results);

            }



        });
        } else if(data.operation === 'update') {

            KioskUnit.UpdateDenomConfig(data,function(err,results) {


            if (err) {
                console.log('UpdateDenomConfig error: ' + err);
                callback(err,null);

            } else {
                 console.log('UpdateDenomConfig written');
                 callback(null,results);

            }



            });
        }


   } else if( data.table ==='sc_deviceConfig') {

        if(data.operation === 'insert') {

            KioskUnit.InsertUnitDevice(data,function(err,results) {

            if (err) {
                console.log('InsertUnitDevice error: ' + err);
                callback(err,null);

            } else {
                 console.log('InsertUnitDevice written');
                 callback(null,results);

            }


            });

        } else if( data.operation ==='update') {

            KioskUnit.UpdateUnitDevice(data,function(err,results) {

            if (err) {
                console.log('UpdateUnitDevice error: ' + err);
                callback(err,null);

            } else {
                 console.log('UpdateUnitDevice written');
                 callback(null,results);

            }


            });


        } else if (data.operation === 'delete') {

            KioskUnit.DeleteUnitDevice(data,function(err,results) {

            if (err) {
                console.log('DeleteUnitDevice error: ' + err);
                callback(err,null);

            } else {
                 console.log('DeleteUnitDevice written');
                 callback(null,results);

            }


            });




        }
   }
    
} exports.ProcessTrans = ProcessTrans
;