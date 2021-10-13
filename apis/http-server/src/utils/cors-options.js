const NREL_DOMAIN_PATTERNS_WHITELIST = require('./nrel-domain-whitelist');

/**
 * A hook method for use with https://www.npmjs.com/package/cors providing users of this
 * package with access to the cors options that will be returned for requests. This
 * method can be imported and used to specify custom cors config for specific endpoints.
 *
 * By default cors is enabled for the POST, GET, PUT, DELETE verbs for a white-listed
 * set of Origins including:
 *  - nrel.gov
 *  - energy.gov
 *  - nrelcloud.org
 *  - localhost
 *  - 127.0.0.1
 *  - 10.0.2.2
 * @param {Object} req - The incoming request
 * @param {function} callback - The callback function that accepts these cors options
 */
const corsOptionsDelegate = (req, callback) => {
  let corsOptions,
      enableCors = false,
      origin = req.header('Origin');

  NREL_DOMAIN_PATTERNS_WHITELIST.forEach(regex => {
    if (regex.test(origin)) {
      //console.log(origin, 'matchtes', regex);
      enableCors = true;
    }
  });

  if (enableCors) {
    // reflect (enable) the requested origin in the CORS response
    corsOptions = {
      origin: true,
      credentials: true
    }
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


module.exports = corsOptionsDelegate;
