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
			method: 'POST',
			path: '/report',
			handler: function(request, reply)
			{
          var params = {};
          try {
            params = JSON.parse(request.payload);
          }
          catch(e) {}

          var created_nodes = params.created_nodes instanceof Array ? params.created_nodes : [];
          var existing_nodes = params.existing_nodes instanceof Array ? params.created_nodes : [];


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
                data.ipid = (request.location.ip || "") + (request.location.rpcport || "") + (request.location.p2pport || "")
                data.callingip = (request.location.ip || "")
                data.callingip_country = (request.location.country || "")
                data.callingip_state = (request.location.region || "")
                data.callingip_lat = ((request.location.loc || "").split(",")[0] || "")
                data.callingip_long = ((request.location.loc || "").split(",")[1] || "")
                data.reportedip = (node.ipaddress || "")
                data.bthaddress = (node.address || "")
                data.blockheight = (node.nodestats_getinfo || {}).blocks || 0
                data.nodetype = node.nodetype;
                query("INSERT INTO bth_nodes SET ? ON DUPLICATE KEY UPDATE ipid = VALUES(ipid),callingip = VALUES(callingip),callingip_country = VALUES(callingip_country),callingip_state = VALUES(callingip_state),callingip_lat = VALUES(callingip_lat),callingip_long = VALUES(callingip_long),reportedip = VALUES(reportedip),bthaddress = VALUES(bthaddress),blockheight = VALUES(blockheight), nodetype = VALUES(nodetype), last_reported_on = NOW()", data, function() {
                      console.log(arguments);
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
