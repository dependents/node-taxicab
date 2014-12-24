var getDriverScripts = require('get-driver-scripts');
var getTreeAsList = require('dependency-tree').getTreeAsList;
var path = require('path');
var q = require('q');

/**
 * Gets the driver script(s) that depend on the given module
 *
 * @param {Object}   options
 * @param {String}   options.filename  - The path of the module whose driver script should be found
 * @param {String}   options.directory - The path to all JS files
 * @param {Function} options.success   - (String[]) Executed with the driver scripts that depend on the given file
 */
module.exports = function(options) {
  if (!options.filename) { throw new Error('filename not given'); }
  if (!options.directory) { throw new Error('directory location not given'); }
  if (!options.success) { throw new Error('success callback not given'); }

  options.filename = path.resolve(options.filename);

  var success = options.success;

  options.success = function(err, drivers) {
    findRelatedDrivers({
      drivers: drivers,
      filename: options.filename,
      directory: options.directory
    })
    .then(function(relatedDrivers) {
      success(null, relatedDrivers);
    }, function(err) {
      success(err);
    });
  };

  getDriverScripts(options);
};

/**
 * Finds the driver scripts from the list that depend on the given
 * file (at some point in the dependency tree)
 *
 * @param  {Object}   options
 * @param  {String[]} options.drivers
 * @param  {String}   options.filename
 * @param  {String}   options.directory
 * @return {Promise}  Resolves with a list of the relevant driver scripts
 */
function findRelatedDrivers(options) {
  return getTrees({
    drivers: options.drivers,
    directory: options.directory
  })
  .then(function(trees) {
    var relatedDrivers = [];

    trees.forEach(function(treeList, idx) {
      if (treeList.indexOf(options.filename) !== -1) {
        relatedDrivers.push(options.drivers[idx]);
      }
    });

    return relatedDrivers;
  });
}

/**
 * Gets the dependency tree for each of the given files
 * @param  {Object}     options
 * @param  {String[]}   options.drivers
 * @param  {String}     options.directory
 * @return {Promise}    (String[]) => null Resolves with a list of trees for each file in the list
 */
function getTrees(options) {
  var cache = {};

  return q.all(options.drivers.map(function(driver) {
    var deferred = q.defer();

    getTreeAsList(driver, options.directory, function(tree) {
      deferred.resolve(tree);
    }, cache);

    return deferred.promise;
  }));
}