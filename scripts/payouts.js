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


query("SELECT * FROM bth_nodes WHERE last_reported_on > DATE_SUB(NOW(), INTERVAL 7 DAY) AND pou_sumpayout > 0.001", [], function(err, rows) {
      if (!err) {
            var payouts = {};
            for (var index in rows) {
                payouts[rows[index].bthaddress] = rows[index].pou_sumpayout
            }
      }
      console.log(JSON.stringify(payouts));
});
