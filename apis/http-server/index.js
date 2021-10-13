#!/usr/bin/env node

require('dotenv').config();

var http = require('http');
var config = require('config');
var { createTerminus } = require('@godaddy/terminus');

var { app, router } = require('./app');
var { normalizePort, getProxiedPath } = require('./src/utils/utils');

var proxyPort = normalizePort(config.PORT);
var port = proxyPort + 1000;

var corsOptionsDelegate = require('./src/utils/cors-options');

// node-http-proxy as a reverse proxy for wishing away the
// extra path components. Actually runs a separate server
// that all incoming traffic connects to. The real
// Express app server is on a different PORT
var proxy = require('http-proxy').createProxyServer({
  target: `http://127.0.0.1:${port}`,
  ws: true
});

if (process.env.NODE_ENV === 'test') {
  // supertest will start the server so we don't need to do anything here
} else {
  proxy.listen(proxyPort);
}

proxy.on('proxyReq', (proxyReq, /* req, res, options */ ) => {
  proxyReq.path = getProxiedPath(proxyReq.path, config.PROXY_PATH)
});

proxy.on('proxyReqWs', (proxyReq, /* req, res, options */ ) => {
  proxyReq.path = getProxiedPath(proxyReq.path, config.PROXY_PATH)
});

proxy.on('error', (err, req, res) => {
  switch (err.code) {
    case 'ECONNRESET':
      // We don't need to do anything with connection resets, the client has already gone away.
      res.end();
      break;
    case 'EPIPE':
      // We don't need to do anything with broken pipes, the client has already gone away.
      res.end();
      break;
    default:
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('An unexpected server error has occurred.');
  }
});

/**
 * Get port from environment and store in Express.
 */
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Add an array of Promise-yeilding functions to the server object that
 * will be executed as part of the graceful shutdown routine. This
 * array can be modified by consumers in order to add their own
 * clean up routines.
 */
server.teardownCallbacks = [];
server.addTeardownCallback = function(callback) {
  this.teardownCallbacks.push(callback);
}

server.setTimeout( 1000*60*10, (socket) => {
  if (socket.remoteFamily !== 'IPv6') {
    console.error('Express timed out');
  }
  socket.destroy();
});

/**
 * Function that manages the execution of each function stored in the
 * `teardownCallbacks` array. This uses `Promise.all` to insure that it does
 * not resolve until all of the callbacks have completed. This function is
 * called by terminus which insures that it is able to complete executing
 * before the server process is terminated.
 */
function tidyUp() {
  let promises = [];
  server.teardownCallbacks.forEach(callback => {
    promises.push(callback());
  });

  return Promise.all(promises)
    .then(() => {
      console.info('All shutdown routines complete');
    })
    .catch((err) => {
      console.warn('Shutdown routines finished with errors');
      console.warn(err);
    })
}

server.tidyUp = tidyUp;

/**
 * A very rudimentary health check that will always succeed as long as the
 * process hasn't stopped altogether. This can be used by AWS or any other
 * monitoring tool if more sophisticated endpoints aren't required.
 */
function healthCheck() {
  return Promise.resolve();
}

var terminusOptions = {
  healthChecks: {
    '/healthcheck': healthCheck
  },
  timeout: 2000,
  signals: ['SIGTERM', 'SIGINT', 'SIGUSR2'],
  onSignal: tidyUp,
  onShutdown: ()=>{console.info('Shutdown complete')},
  console: console.info
}

createTerminus(server, terminusOptions);

/**
 * Listen on provided port, on all network interfaces.
 */
if (process.env.NODE_ENV === 'test') {
  // supertest will start the server so we don't need to do anything here
} else {
  server.listen(port);
}
server.on('error', onError);
server.on('clientError', onError);
server.on('listening', onListening);

server.setTimeout(1000*60*10, (socket) => {
  if(socket.remoteFamily !== 'IPv6') {
    console.error('Express timed out');
  }
  socket.destroy();
});

/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error, socket) {
  console.error('http server error');
  console.error(error);

  // We expect random TCP carnage when reading and writing because
  // pipes do break for normal reasons. Other states are indicative
  // of actual problems we shouldn't swallow
  if ( !['listen', 'read', 'write'].includes(error.syscall)) {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    case 'ECONNRESET':
      console.warn('http server received connection reset error');
      if(!socket.writable) {
        return;
      } else {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      }
      break;
    case 'EPIPE':
      console.warn('http server pipe severed while writing. noop');
    default:
      return //throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
  console.debug(`Server listening on ${proxyPort}`);
}


module.exports = {
  app,
  corsOptionsDelegate,
  proxy,
  router,
  server,
};
