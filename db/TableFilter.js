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
                data = null;
 			    callback(err,null);
 		    } else {
 			    console.log('Event written');
                data = null;
 			    callback(null,results);
 		    }

 	    });
     } else if ( data.table === 'db_onlinemeters') {
 	    KioskMeters.UpdateOnlineMeters(data,function(err,results){
 		    if (err) {
 			    console.log('Update Online Meters error: ' + err);
                data = null;
 			    callback(err,null);
 		    } else {
 			    console.log('Online meters written');
                data = null;
 			    callback(null,results);
 		    }

 	    });
      

    
     } else if (data.table === 'db_atmTrans') {

 
         if(data.operation ==='insert'){


                 atm.WriteAtmTrans(data,function(err,results) {
                 
                 if (err) {
                 	console.log('WriteAtmTrans error: ' + err);
                    data = null;
                 	callback(err,null);
                 } else {
                 	 console.log('atm trans written');
                     data = null;
                 	 callback(null,results);
                 }
             });
         } else if (data.operation === 'update') {

                 atm.UpdateAtmTrans(data,function(err,results) {
                 
                 if (err) {
                    console.log('UpdateAtmTrans error: ' + err);
                    data = null;
                    callback(err,null);
                 } else {
                     console.log('UpdateAtmTrans written');
                     data = null;
                     callback(null,results);
                 }
             });


         }

     } else if (data.table === 'db_unitTransMeters') {
     	KioskMeters.WriteOnlineMeterSnapshot(data,function(err,results) {

             if (err) {
             	console.log('WriteOnlineMeterSnapshot error: ' + err);
                data = null;
             	callback(err,null);
             } else {
             	 console.log('WriteOnlineMeterSnapshot written');
                 data = null;
             	 callback(null,results);
             }



     	});
     } else if (data.table === 'db_LtdOccurMeters') {

        KioskMeters.UpdateDoorSwitchMeters(data,function(err,results) {

             if (err) {
                console.log('UpdateDoorSwitchMeters error: ' + err);
                data = null;
                callback(err,null);
             } else {
                 console.log('UpdateDoorSwitchMeters written');
                 data = null;
                 callback(null,results);
             }
 

        });
     } else if (data.table === 'db_unitTrans') {
       

          if(data.operation === 'initial_write') {

             KioskTrans.WriteKioskTrans(data,function(err,results) {

             if (err) {
                console.log('WriteKioskTrans error: ' + err);
                data = null;
                callback(err,null);
             } else {
                 console.log('WriteKioskTrans written');
                 data = null;
                 callback(null,results);
             }

         });
      } else if (data.operation === 'complete') {
  
          KioskTrans.CompleteCurrentTrans(data,function(err,results) {

             if (err) {
                console.log('CompleteCurrentTrans error: ' + err);
                data = null;
                callback(err,null);
             } else {
                 console.log('CompleteCurrentTrans written');
                 data = null;
                 callback(null,results);
             }

         });

      
      } else if (data.operation === 'pending_to_complete') {

          KioskTrans.SetPendingTransToComplete(data,function(err,results) {

             if (err) {
                console.log('SetPendingTransToComplete error: ' + err);
                data = null;
                callback(err,null);
             } else {
                 console.log('SetPendingTransToComplete written');
                 data = null;
                 callback(null,results);
             }

         });



      }
   } else if (data.table === 'db_unitTransDetail') {

        KioskTrans.WriteUnitTransDetail(data,function(err,results) {
   
            if (err) {
                console.log('WriteUnitTransDetail error: ' + err);
                data = null;
                callback(err,null);

            } else {
                 console.log('WriteUnitTransDetail written');
                 data = null;
                 callback(null,results);

            }

        });

   } else if (data.table === 'sc_units') {


       if(data.operation === 'update') {


           KioskUnit.UpdateKioskUnit(data,function(err,results) {

                if (err) {
                    console.log('UpdateKioskUnit error: ' + err);
                    data = null;
                    callback(err,null);

                } else {
                     console.log('UpdateKioskUnit written');
                     data = null;
                     callback(null,results);

                }

           });
       } else if(data.operation == 'update_app_version') {

           KioskUnit.UpdateAppVersion(data,function(err,results) {
  
              if (err) {
                    console.log('UpdateAppVersion error: ' + err);
                    data = null;
                    callback(err,null);

                } else {
                     console.log('UpdateAppVersion written');
                     data = null;
                     callback(null,results);

                }



           });
       } else if (data.operation === 'update_creditcard') {

           KioskUnit.UpdateCreditCardOption(data,function(err,results) {
  
              if (err) {
                    console.log('UpdateCreditCardOption error: ' + err);
                    data = null;
                    callback(err,null);

                } else {
                     console.log('UpdateCreditCardOption written');
                     data = null;
                     callback(null,results);

                }



           });
       }
   } else if (data.table === 'sc_unitConfig') {

        if(data.operation === 'delete') {

            KioskUnit.DeleteUnitDenomConfig(data,function(err,results) {

            if (err) {
                console.log('DeleteUnitDenomConfig error: ' + err);
                data = null;
                callback(err,null);

            } else {
                 console.log('DeleteUnitDenomConfig written');
                 data = null;
                 callback(null,results);

            }



        });
        } else if(data.operation === 'update') {

            KioskUnit.UpdateDenomConfig(data,function(err,results) {


            if (err) {
                console.log('UpdateDenomConfig error: ' + err);
                data = null;
                callback(err,null);

            } else {
                 console.log('UpdateDenomConfig written');
                 data = null;
                 callback(null,results);

            }



            });
        }


   } else if( data.table ==='sc_deviceConfig') {

        if(data.operation === 'insert') {

            KioskUnit.InsertUnitDevice(data,function(err,results) {

            if (err) {
                console.log('InsertUnitDevice error: ' + err);
                data = null;
                callback(err,null);

            } else {
                 console.log('InsertUnitDevice written');
                 data = null;
                 callback(null,results);

            }


            });

        } else if( data.operation ==='update') {

            KioskUnit.UpdateUnitDevice(data,function(err,results) {

            if (err) {
                console.log('UpdateUnitDevice error: ' + err);
                data = null;
                callback(err,null);

            } else {
                 console.log('UpdateUnitDevice written');
                 data = null;
                 callback(null,results);

            }


            });


        } else if (data.operation === 'delete') {

            KioskUnit.DeleteUnitDevice(data,function(err,results) {

            if (err) {
                console.log('DeleteUnitDevice error: ' + err);
                data = null;
                callback(err,null);

            } else {
                 console.log('DeleteUnitDevice written');
                 data = null;
                 callback(null,results);

            }


            });




        }
   }
    
} exports.ProcessTrans = ProcessTrans
;