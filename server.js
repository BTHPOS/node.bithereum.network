// Dependencies
var Boom    = require('boom');
var Joi     = require('joi');
var Path    = require('path');
var Hapi    = require('hapi');
var Vision 	= require('vision');
var Inert 	= require('inert');
var got 		= require('got');
var GeoLocation = require('hapi-geo-locate');

// Template Engine
var Handlerbars = require('handlebars');
var HandlebarsLayouts = require('handlebars-layouts');
HandlebarsLayouts.register(Handlerbars);

// Initialize MySQL
var mysql      = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'chaindata.bithereum.network',
    user     : 'root',
    password : 'btcinnovations1923!',
    database : 'chaindata'
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
	await server.register(GeoLocation);

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
			path: '/all',
			handler: function(request, reply)
			{
          return new Promise(function(resolve, reject) {
              query("SELECT * FROM bth_nodes WHERE 1", [], function(err, rows) {
                    if (!err) resolve({nodes: rows});
                    else resolve({nodes:[]})
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

          console.log("====================================================================");
          console.log(request.location)
          console.log(request.payload);
          console.log(params);

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
                data.ipid = (request.location.ip || "").split(".").join("") + (node.rpcport || "") + (node.p2pport || "") + (node.address || "")
                data.callingip = (request.location.ip || "")
                data.callingip_country = (request.location.country || "")
                data.callingip_region = (request.location.region || "")
                data.callingip_lat = ((request.location.loc || "").split(",")[0] || "")
                data.callingip_long = ((request.location.loc || "").split(",")[1] || "")
                data.callingip_hostname = (request.location.hostname || "")
                data.callingip_city = (request.location.city || "")
                data.callingip_postal = (request.location.postal || "")
                data.callingip_org = (request.location.org || "")
                data.reportedip = (node.ipaddress || "")
                data.rpcport = (node.rpcport || "")
                data.p2pport = (node.p2pport || "")
                data.bthaddress = (node.address || "")
                data.blockheight = (node.nodestats_getinfo || {}).blocks || 0
                data.nodetype = node.nodetype;
                query("INSERT INTO bth_nodes SET ? ON DUPLICATE KEY UPDATE ipid = VALUES(ipid),callingip = VALUES(callingip),callingip_country = VALUES(callingip_country),callingip_region = VALUES(callingip_region),callingip_city = VALUES(callingip_city), callingip_hostname = VALUES(callingip_hostname), callingip_postal = VALUES(callingip_postal), callingip_org = VALUES(callingip_org), callingip_lat = VALUES(callingip_lat),callingip_long = VALUES(callingip_long),reportedip = VALUES(reportedip),bthaddress = VALUES(bthaddress),blockheight = VALUES(blockheight), nodetype = VALUES(nodetype), last_reported_on = NOW()", data, function() {
                });
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
