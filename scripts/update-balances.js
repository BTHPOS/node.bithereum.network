// HTTP Requests
var got = require('got');

// Database connection
let mysql      = require('mysql');
let pool = mysql.createPool({
});

let query = function(query, data, callback) {
    pool.getConnection(function(err, connection) {
         if (!err) {
            connection.query(query, data, function (error, results, fields) {
                connection.release();
                if (typeof callback == "function") callback(error, results, fields);
              });
         }
    });
};

let tiers = [
    {tier: 0, usd: 0, bthperweek:0.1, bthperyear:5.2},
    {tier: 1, usd: 0.5, bthperweek:1, bthperyear:52},
    {tier: 2, usd: 5, bthperweek:3, bthperyear:156},
    {tier: 3, usd: 25, bthperweek:10, bthperyear:520},
    {tier: 4, usd: 50, bthperweek:15, bthperyear:780},
    {tier: 5, usd: 250, bthperweek:25, bthperyear:1300},
];


let updateBalances = function() {
  got("https://api.coingecko.com/api/v3/coins/bithereum/tickers").then(function(data) {

       var BTHUSD = 0.01;

       let getTier = function(holding) {
           holding = holding || 0;
           let holdingUSD = holding * BTHUSD;
           for (var index in tiers) {
               if (holdingUSD < tiers[index].usd) {
                   return tiers[index-1] || {};
               }
           }
           return tiers[tiers.length-1];
       };

      if (data.body) {
          try {
              data = resolve(JSON.parse(data.body));
          }
          catch (e) {
              data = {}
          }
      }

      console.log(data);

       if (data && data.tickers) {
           let total_coverted_volume = 0;
           data.tickers.forEach(function(ticker) {
                total_coverted_volume += ticker.converted_volume.usd;
           });
           data.tickers = data.tickers.map(function(ticker) {
              ticker.volume_percentage = (ticker.converted_volume.usd/total_coverted_volume)
              return ticker;
           })
           data.tickers.forEach(function(ticker) {
                BTHUSD += (ticker.volume_percentage * ticker.converted_last.usd)
           });
           if (BTHUSD > 0) BTHUSD = BTHUSD.toFixed(4);
      }


      query("SELECT * FROM bth_nodes", [], function(err, rows) {
            if (!err) {
                for (var row in rows) {

                    var _address = rows[row].bthaddress
                    var _pou_shares = rows[row].pou_shares
                    var _previous_pou_shares = rows[row].previous_pou_shares
                    var _url = "http://insight.bithereum.network/insight-api/addr/"+_address+"/?noTxList=1"

                    var setbalance = function(address, url, pou_shares, previous_pou_shares) {
                        got(url).then(function(data) {
                            if (data.body)  {
                                  var balance = 0;
                                  try {
                                      var response = JSON.parse(data.body);
                                      balance = response.balance;
                                  } catch(e) {}

                                  console.log(address,"-->",balance);
                                  var tier = getTier(balance)
                                  query("UPDATE bth_nodes SET balance = '"+balance+"', pou_tier = '"+tier.tier+"', pou_payout = '"+tier.bthperweek+"', balance_updated_on=NOW() WHERE `bthaddress` = '"+address+"'")
                              }
                        });
                    }

                    if (_address) setbalance(_address, _url, _pou_shares, _previous_pou_shares);

                }
            }
      });

  });

};


setInterval(function() {
      updateBalances();
  },  30 * (60 * 1000) );

  updateBalances();
