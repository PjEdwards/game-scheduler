const _ = require('lodash');
const fs = require('fs');

/**
 * Function wrapping lodash's template rendering system providing an easy interface
 * for rendering a template. This is used by Express
 *
 * @param {string} path - path to the template file
 * @param {object} options - passed to the lodash template method
 * @param {function} callback - called with the rendered template, or errors if that's a thing
 */
module.exports = function (path, options, callback) {
  fs.readFile(path, 'utf8', function (err, content) {
    if (err) return callback(err);
    const rendered = _.template(content)(options)
    return callback(null, rendered);
  });
};