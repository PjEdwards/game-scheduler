/**
 * An API microservice template with reusable essential express and middleware setup
 * @module http=server
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const requestLogger = require('morgan');
const helmet = require('helmet');
const app = express();
const router = require('./src/routes/index');
let config = require('config');
let globalConfig = config.util.loadFileConfigs(path.resolve('..', '..', 'scripts', 'configs', 'nodejs_service'));
config = config.util.extendDeep({}, globalConfig, config);

// Manages a bunch of our Cyber required security headers
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
  }
}));

app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

app.use(helmet.hsts({
  maxAge: 63072000,
  includeSubDomains: true,
  preload: true
}));

// DO NOT DELETE
// This line is here to be uncommented when we need to run scripts that do bulk updates to a lot of layers
// See `convert-old-layer-format-to-new.js` for an example
// app.use(bodyParser.json({limit: '500mb'}));

// The Expect-CT header  was required, then unrequired by Cyber. Might
// come back
// app.use(helmet.expectCt({
//   enforce: false,
//   maxAge: 63072000,
//   reportUri: 'https://ct-report.nrel.gov'
// }));

// view engine setup
app.engine('lodash', require('./src/utils/lodash-template-engine'));
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'lodash');

let accessLogExclusions = ['/', '/favicon.ico', '/stylesheets/style.css'];

// Request logging with a place for errors and a place for all
if(process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {
  app.use(
    requestLogger('access: ":method :url" :status :res[content-length]', {
      skip: (req /*, res*/) => {
        return accessLogExclusions.includes(req.path);
      },
      stream: fs.createWriteStream(path.join(process.cwd(), 'logs', 'combined.log'), {flags: 'a'})
    })
  );
  app.use(
    requestLogger('access: ":method :url" :status :res[content-length]',
      {
        skip: (req, res) => {
          return res.statusCode < 400;
        },
        stream: fs.createWriteStream(path.join(process.cwd(), 'logs', 'error.log'), { flags: 'a' })
      })
  );
} else {
  app.use(
    requestLogger('access: ":method :url" :status :res[content-length]',
      {
        skip: (req /*, res*/) => {
          return accessLogExclusions.includes(req.path);
        }
      })
  );

  require('vite').createServer({
    root: process.cwd(),
    logLevel: 'debug',
    server: {
      middlewareMode: true,
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 100
      }
    }
  })
    .then((vite) => {
      console.log(vite);
      // use vite's connect instance as middleware
      app.use(vite.middlewares)
    })
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res /*, next*/) {
  res.status(404);
  res.send('Not Found.');
});

// error handler
app.use(function(err, req, res /*, next*/) {
  // set locals, only providing error in development
  res.locals.title = config.APP_NAME
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development'
    ? err
    : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = {
  app,
  router
};
