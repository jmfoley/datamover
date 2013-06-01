var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';


function callback(error,results){};


function StartTenCoinTest( data,callback) {

  var sql = '';
  var connection;

  dbConnect.GetDbConnection(data.operatorid,function(err,results) {
  	if (err){
	    errMsg = 'GetDbConnection error: ' + err;
	    callback(errMsg,null);

  	} else {
        connection = results;
        sql = 'insert into db_tenCoin( reportdate, started, machineNumber, machineDenom, bf_coin_in, bf_coin_out, bf_coin_drop, ' +
                    'bf_games, bf_bill_1, bf_bill_2, bf_bill_5, bf_bill_10, bf_bill_20, bf_bill_50, bf_bill_100, bf_jackpot, bf_cancel_credit, ' +
                    'bf_red_cash_ct, bf_red_cash_amt, bf_red_promo_ct, bf_red_promo_amt, bf_prt_cash_ct, bf_prt_cash_amt, bf_prt_promo_ct, bf_prt_promo_amt,' +
                    'bf_aft_cash_in, bf_aft_cash_out, bf_aft_promo_in, bf_aft_promo_out, startedBy, startedFrom, updatedBy, updatedFrom, propId, updated, ' +
                    'reportnum, bf_machPaidExternBonus, bf_attPaidExternBonus, bf_machPaidProgBonus, bf_attPaidProgBonus) select @reportDate, GETDATE(), ' +
                    '@machineNumber, a.mach_denom, a.ol_coin_in, a.ol_coin_out, a.ol_coin_drop, a.ol_games, a.ol_bill_1, a.ol_bill_2, a.ol_bill_5, ' +
                    'a.ol_bill_10, a.ol_bill_20, a.ol_bill_50, a.ol_bill_100, a.ol_jackpot, a.ol_cancel_credit, b.RedeemCashable_ct, CAST(b.RedeemCashable_amt * 100 as int) as RedeemCashable_amt, ' +
                    'b.RedeemPromo_ct, CAST(b.RedeemPromo_amt * 100 as int) as RedeemPromo_amt, b.PrintedCashable_ct, CAST(b.PrintedCashable_amt * 100 as int) as PrintedCashable_amt, b.PrintedPromo_ct, CAST(b.PrintedPromo_amt * 100 as int) as PrintedPromo_amt, ' +
                    'c.CashableCredits, c.cashableCreditsOut, c.PromoCredits, c.promoCreditsOut, @userId, @workstation, @userId, @workstation, @propId, GETDATE(), ' +
                    '@reportNum, b.machPaidExternBonus, b.attPaidExternBonus, b.machPaidProgBonus, b.attPaidProgBonus from CMS.dbo.slots a left outer join ticketMeters b on a.mach_num = b.mach_num ' +
                    'left outer join EFTMeters c on a.mach_num = c.mach_num where a.mach_num = @machineNumber';


        var request = new Request(sql,function(err,results) {
            if (err) {
                errMsg = 'StartTenCoinTest error: '  + err;
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


        
        

    }




  });


}exports.StartTenCoinTest = StartTenCoinTest;