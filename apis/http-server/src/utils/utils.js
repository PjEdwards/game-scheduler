

/**
 * Find the most viable port in either the process.env
 * or the config, then cast as int to make sure
 * 
 * @param {int|string} port the configured port value
 * 
 * @returns {int} the normalized port value
 */
normalizePort = function(port) {
  port = process.env.PORT || port || 3000;
  return parseInt(port);
}


/**
 * Rewrite the path before proxying insuring that there 
 * is a trailing slash instead of an empty path
 * 
 * @param {String} path The path portion of the request URL
 * @param {*} proxyPath The application's path e.g. /rede
 * 
 * @returns {String} A new path with the proxyPath portion removed
 */
getProxiedPath = function(path, proxyPath) {
  let rgx = new RegExp(`^/${proxyPath}(.*)`),
      newPath = path.replace(rgx, '$1') || '/';

  return newPath;
}


module.exports = {
  getProxiedPath,
  normalizePort
}
