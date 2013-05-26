var SendGrid = require('sendgrid-nodejs').SendGrid;
var Email = require('sendgrid-nodejs').Email;

var sender = new SendGrid('azure_78e4f021276d2d5749a5a24469737218@azure.com',
                          'umluqqq4'); 


function callback(error,results){};

function SendReport( data,callback) {

var crashData = 'Operator: ' + data.operatorid + ' prop: ' + data.propid + ' unit: ' + data.unit + '\r\n trace: ' +
            data.trace;


var email = new Email({
   to: ['jfoley@m3ts.com','skotova@m3ts.com','mcarpenter@m3ts.com','kbowden@m3ts.com'],
   from: 'kioskcrash@m3ts.com',
   subject: 'Ignore, just testing some crash notification stuff',
   text : crashData
});




sender.send(email,function(success,err){
      if(success){
        callback(null,success);
     }
     else {
        callback(err,null);
     }

});

}exports.SendReport = SendReport;

