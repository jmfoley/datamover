var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';


function callback(error,results){};

function CheckMultiGameConfig(connection,data,callback) {

    var sql = 'select count(*) from sc_multigameconfig where machineNumber = @mach and multiTypeRecId = @recid and propid = @propid';


    var request = new Request(sql,function(err,rowCount) {
    	if (err) {
            sql = null;
            delete request;
            errMsg = 'CheckMultiGameConfig error: '  + err;
    		callback(errMsg,null);
    	} else {
             sql = null;
             delete request;
    		callback(null,rowCount);
    	}

    });          


        request.addParameter('mach', TYPES.Int,data.machnum);
        request.addParameter('recid', TYPES.VarChar,data.recid);
        request.addParameter('propid', TYPES.Int,data.propid);
        
        connection.execSql(request);

};



function WriteMultiGameConfig(data,callback){
    
    var sql = '';
    var connection;
    var insert;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    	if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

    	} else {
            connection = results;
            CheckMultiGameConfig(connection,data,function(err,rowCount) {
                if( err ) {
                   callback(err,null) ;
                } else {
                   if (rowCount < 1) {
                       sql = 'insert into sc_multigameconfig (operatorId,machineNumber,multiTypeId,multiTypeDesc,payTableId,' +
                             'parPct,maxBet,denom,gameEnabled,status,updatedBy,updatedFrom,updated)values(@oper,@mach,@type,' +
                             '@desc,@pay,@par,@max,@denom,@enabled,@status,@updatedBy,@updatedFrom,@date)';

                        var request = new Request(sql,function(err,results) {
                            if (err) {
                                errMsg = 'WriteMultiGameConfig error: '  + err;
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
                        request.addParameter('mach', TYPES.Int,data.mach);
                        request.addParameter('type', TYPES.Int,data.game);
                        request.addParameter('desc', TYPES.Varchar,'');
                        request.addParameter('pay',  TYPES.VarChar,data.paytable);
                        request.addParameter('par',  TYPES.Numeric,data.par);
                        request.addParameter('max',  TYPES.Int,data.max);
                        request.addParameter('denom',TYPES.Int,data.denom);
                        request.addParameter('enabled', TYPES.Bit,data.enabled);
                        request.addParameter('status', TYPES.Int,0);
                        request.addParameter('updatedby', TYPES.VarChar,data.updatedby);
                        request.addParameter('updatedfrom', TYPES.VarChar,data.updatedfrom);
                        request.addParameter('date', TYPES.DateTime,new Date());

                        connection.execSql(request);

                   } 
                }

            });
    	}

    });


} exports.WriteMultiGameConfig = WriteMultiGameConfig;





function CheckMultiGameRecord(connection,data,callback) {

    var sql = 'select count(*) from db_multigamemeters where machineNumber = @mach and gamenumber = @game and propid = @propid';


    var request = new Request(sql,function(err,rowCount) {
        if (err) {
            sql = null;
            delete request;
            errMsg = 'CheckMultiGameRecord error: '  + err;
            callback(errMsg,null);
        } else {
             sql = null;
             delete request;
            callback(null,rowCount);
        }

    });          


        request.addParameter('mach', TYPES.Int,data.mach);
        request.addParameter('game', TYPES.Int,data.gamenumber);
        request.addParameter('propid', TYPES.Int,data.propid);
        
        connection.execSql(request);

};



function WriteMultiGameRecord(data,callback){
    var insert = false;
    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

        } else {
            connection = results;
            CheckMultiGameRecord(connection,data,function(err,rowCount) {
                if (err) {
                    connection.close();
                    callback(err,null);
                } else {
                    if (rowCount > 0 ) {
                        sql = 'update db_multigamemeters set coinin = @cin,coinout = @cout,gamesplayed = @games,jackpot = @jpot,' +
                              'updated = @date,sasversion = @sas,denom = @denom,maxbet = @max,paytableid = @pay,gamepar = @par,' +
                              'gameenabled = @enabled,onlineid = @id where machinenumber = @mach and gamenumber = ' +
                              '@gamenumber and propid = @propid'
                    } else {
                        insert = true;
                        sql = 'insert into db_multigamemeters(operatorid,onlineid,gamenumber,machinenumber,coinin,coinout,' +
                              'gamesplayed,jackpot,updated,sasversion,denom,maxbet,paytableid,gamepar,gameenabled,propid) ' +
                              'values(@oper,@id,@gamenumber,@mach,@cin,@cout,@games,@jpot,@date,@sas,@denom,@max,@pay,' +
                              '@par,@enabled,@propid)';  
                    }

                    var request = new Request(sql,function(err,results) {
                        if (err) {
                            errMsg = 'WriteMultiGameRecord error: '  + err;
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

                    if (insert) {
                       request.addParameter('oper', TYPES.Int,data.operatorid);
                    }
                    request.addParameter('id', TYPES.Int,data.onlineid);
                    request.addParameter('cin', TYPES.Int,data.coinin);
                    request.addParameter('cout', TYPES.Int,data.coinout);
                    request.addParameter('games', TYPES.Int,data.gamesplayed);
                    request.addParameter('jpot', TYPES.Int,data.jackpot);
                    request.addParameter('date', TYPES.DateTime, new Date());
                    request.addParameter('sas', TYPES.VarChar,data.sasver);
                    request.addParameter('denom', TYPES.Numberic,data.denom);
                    request.addParameter('max', TYPES.Int,data.maxbet);
                    request.addParameter('pay', TYPES.VarChar,data.paytable);
                    request.addParameter('par', TYPES.Numeric,data.par);
                    request.addParameter('enabled', TYPES.Bit,data.enabled);
                    request.addParameter('propid', TYPES.Int,data.propid);
                    request.addParameter('gamenumber', TYPES.Int,data.gamenumber);
                    request.addParameter('mach', TYPES.Int,data.mach);

                    connection.execSql(request);



                }
            });
        }



} exports.WriteMultiGameRecord = WriteMultiGameRecord;


