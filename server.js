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
			path: '/report',
			handler: function(request, reply)
			{
          var params = request.payload;
          console.log(request.location);
          // var data = {};
          // data.ipid =
          // data.callingip = "10.68.38.21";
          // data.callingip_country = "United States";
          // data.callingip_state = "New Jersey";
          // data.callingip_lat = "20.39288222";
          // data.callingip_long = "-74.30382222";
          // data.reportedip = "192.168.1.1";
          // data.bthaddress = "00000";
          // data.blockheight = 398291;
          // data.nodetype = "existing_nodes";
          //
          // query("INSERT INTO bth_nodes SET ? ON DUPLICATE KEY UPDATE ipid = VALUES(ipid),callingip = VALUES(callingip),callingip_country = VALUES(callingip_country),callingip_state = VALUES(callingip_state),callingip_lat = VALUES(callingip_lat),callingip_long = VALUES(callingip_long),reportedip = VALUES(reportedip),bthaddress = VALUES(bthaddress),blockheight = VALUES(blockheight), nodetype = VALUES(nodetype), last_reported_on = NOW()", data, function() {
          //       console.log(arguments);
          // });

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
