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

setInterval(function() {

      query("SELECT * FROM bth_nodes", [], function(err, rows) {
            if (!err) {
                for (var row in rows) {

                    var _address = rows[row].bthaddress
                    var _url = "http://insight.bithereum.network/insight-api/addr/"+_address+"/?noTxList=1"

                    var getBalance = function(address, url) {
                        got(url).then(function(data) {
                            if (data.body)  {
                                  var balance = 0;
                                  try {
                                      var response = JSON.parse(data.body);
                                      balance = response.balance;
                                  } catch(e) {}
                                  console.log(address,"-->",balance);
                                  query("UPDATE bth_nodes SET balance = '"+balance+"', balance_updated_on=NOW() WHERE `bthaddress` = '"+address+"'")
                              }
                        });
                    }

                    if (_address) getBalance(_address, _url);

                }
            }
      });

  },  30 * (60 * 1000) );
