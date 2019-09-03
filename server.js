// Dependencies
var Boom    = require('boom');
var Joi     = require('joi');
var Path    = require('path');
var Hapi    = require('hapi');
var Vision 	= require('vision');
var Inert 	= require('inert');
var got 		= require('got');

var geolite2  = require('geolite2');
var maxmind   = require('maxmind');
var moment    = require("moment");

var citylookup = {};
var countrylookup = {};
var asnlookup = {};

maxmind.open(geolite2.paths.city).then(function(result) {
    citylookup = result;
});
maxmind.open(geolite2.paths.country).then(function(result) {
    countrylookup = result;
});
maxmind.open(geolite2.paths.asn).then(function(result) {
    asnlookup = result;
});

// Template Engine
var Handlerbars = require('handlebars');
var HandlebarsLayouts = require('handlebars-layouts');
HandlebarsLayouts.register(Handlerbars);

// Initialize MySQL
var mysql      = require('mysql');
var pool = mysql.createPool({
});

// Query helper function
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

// HTTP Server
var server = Hapi.server({
	 	port: 8002,
	  routes: {
			cors: {
				credentials: true
			}
	 }
});

// HTTP Server Initialization Configuration
var initialization = async function() {

	// Register modules
	await server.register(Vision);
	await server.register(Inert);

	// Setup view rendering
	server.views({
			engines: {
					html: {
						module: Handlerbars
					}
			},
			relativeTo: Path.join(__dirname, 'public'),
			path: './views',
			partialsPath: './views'
	});

	server.route({
			method: 'GET',
			path: '/',
			handler: function(request, reply)
			{
					return reply.view('embed-base', {});
			}
	});

	server.route({
			method: 'GET',
			path: '/price',
			handler: function(request, reply)
			{
					return new Promise(function(resolve, reject) {
              got("https://api.coingecko.com/api/v3/coins/bithereum/tickers").then(function(data) {
                  if (data.body) {
                      try {
                        return resolve(JSON.parse(data.body));
                      }
                      catch (e) {
                          resolve();
                      }
                  }
              })
          });

			}
	});

	server.route({
			method: 'GET',
			path: '/uptime',
			handler: function(request, reply)
			{
          var address = request.query.bthaddress
          return new Promise(function(resolve, reject) {
              query("SELECT * FROM bth_nodes WHERE bthaddress = ?", [address], function(err, rows) {
                    if (!err) {
                      rows = rows.map(function(row) {
                          row.last_reported_on_formatted = moment(row.last_reported_on).fromNow();
                          row.isup = row.last_reported_on_formatted == "a few seconds ago";
                          return row;
                      });
                      resolve({nodes: rows});
                    } else resolve({nodes:[]})
              });
          });
      }
  });

	server.route({
			method: 'GET',
			path: '/all',
			handler: function(request, reply)
			{
          return new Promise(function(resolve, reject) {
              query("SELECT * FROM bth_nodes WHERE blockheight > 0", [], function(err, rows) {
                    if (!err) {
                      rows = rows.map(function(row) {
                          row.last_reported_on_formatted = moment(row.last_reported_on).add(4, 'hours').fromNow();
                          row.isup = row.last_reported_on_formatted == "a few seconds ago";
                          return row;
                      });
                      resolve({nodes: rows});
                    } else resolve({nodes:[]})
              });
          });
      }
  });

	server.route({
			method: 'POST',
			path: '/report',
			handler: function(request, reply)
			{
          var params = {};
          try {
            params = JSON.parse(request.payload);
          }
          catch(e) {}

          try {
              var ipaddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;

              var asn = asnlookup.get(ipaddress);
              var city = citylookup.get(ipaddress);
              var country = countrylookup.get(ipaddress);

              var created_nodes = params.created_nodes instanceof Array ? params.created_nodes : [];
              var existing_nodes = params.existing_nodes instanceof Array ? params.existing_nodes : [];


              created_nodes = created_nodes.map(function(node) {
                  node.nodetype = "created_nodes";
                  return node;
              })

              existing_nodes = existing_nodes.map(function(node) {
                  node.nodetype = "existing_nodes";
                  return node;
              })

              var nodes = created_nodes.concat(existing_nodes);

              for (var index in nodes) {
                    var node = nodes[index];
                    var data = {};
                    data.ipid = (ipaddress || "").split(".").join("") + (node.rpcport || "") + (node.p2pport || "") + (node.address || "")
                    data.callingip = (ipaddress || "")
                    data.callingip_country = (city.country.names.en || "")
                    data.callingip_region = city.city ? (city.city.names.en || "") : city.continent ? (city.continent.names.en || "") : ""
                    data.callingip_lat = city.city && city.city.location ? (city.city.location.latitude || "") : (city.location.latitude || "")
                    data.callingip_long = city.city && city.city.location ? (city.city.location.longitude || "") : (city.location.longitude || "")
                    data.callingip_timezone = city.city && city.city.location ? (city.city.location.time_zone || "") : (city.location.time_zone || "")
                    data.callingip_city = city.city ? (city.city.names.en || "") : ""
                    data.callingip_postal = city.city && city.city.postal ? (city.city.postal.code || "") : (city.postal ? city.postal.code : "")
                    data.callingip_org = asn ? (asn.autonomous_system_number || "") + " " + (asn.autonomous_system_organization || "") : ""
                    data.reportedip = (node.ipaddress || "")
                    data.rpcport = (node.rpcport || "")
                    data.p2pport = (node.p2pport || "")
                    data.bthaddress = (node.address || "")
                    data.blockheight = (node.nodestats_getinfo || {}).blocks || 0
                    data.nodetype = node.nodetype;
                    data.nodetool_version = (params.nodetool_version || "")
                    data.nodetool_os = (params.nodetool_operatingsystem || "")
                    data.nodetool_identifier = params.nodetool_identifier || ""


                    var addUpdateNodes = function(_data, highest_shares) {
                        var nodeQueryParams = [
                            "reportedip='" + _data.reportedip + "'",
                            "rpcport='" + _data.rpcport + "'",
                            "p2pport='" + _data.p2pport + "'",
                            "bthaddress='" + _data.bthaddress + "'"
                        ];
                        query("SELECT * FROM bth_nodes WHERE " + nodeQueryParams.join(" AND "), {}, function(err, rows) {
                            if (!err && rows.length > 0) {

                                let entry = rows[0]
                                // _data.pou_uptime = entry.pou_shares/highest_shares
                                // _data.pou_bonus = entry.pou_uptime > 0.5 ? 10 : (entry.pou_uptime > 0.25 ? 5 : 0)
                                // _data.pou_weighed_payout = entry.pou_uptime * entry.pou_payout
                                // _data.pou_sumpayout = entry.pou_weighed_payout + entry.pou_bonus

                                query("UPDATE bth_nodes SET pou_uptime = pou_shares/"+highest_shares+", pou_bonus=IF(pou_uptime>0.25,IF(pou_uptime<0.5, 5, 10),0), pou_weighed_payout = pou_uptime * pou_payout, pou_sumpayout = pou_weighed_payout * pou_bonus, last_reported_on = NOW() WHERE 1")
                                query("UPDATE bth_nodes SET "+(_data.blockheight != 0 ? "pou_shares = pou_shares + 1,":"pou_shares = pou_shares")+" WHERE id = '"+entry.id+"'", _data)
                            }
                            else {
                                query("INSERT INTO bth_nodes SET ?", _data);
                            }
                        });
                    };

                    query("SELECT MAX(pou_shares) as highest_shares FROM bth_nodes WHERE 1", {}, function(err, rows) {
                          if (!err && rows.length > 0) {
                              addUpdateNodes(data, rows[0].highest_shares);
                          }
                    })

              }
          }
          catch(e) {
          }

          return {"received": true};
			}
	});

	// Handles public file routing
	server.route({
	    method: 'GET',
	    path: '/{param*}',
	    handler: {
	        directory: {
	            path: 'public',
	            listing: true
	        }
	    }
	});

	// Attempt to start the HTTP Server
	try {
			await server.start();
	}
	catch (err) {
			process.exit(1);
	}
};

// Initilize HTTP Server
initialization();
