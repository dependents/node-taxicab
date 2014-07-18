var getDriverScripts = require('amd-driver-scripts'),
    getModulesToBuild = require('get-modules-to-build'),
    getTreeAsList = require('dependency-tree').getTreeAsList,
    path = require('path'),
    q = require('q');

/**
 * Gets the driver script(s) that depend on the given module
 * @param  {String} file      - The path of the module whose driver script should be found
 * @param  {String} root      - The path where all JS files are
 * @param  {Function} cb - (String[]) Executed with the driver scripts that depend on the given file
 * @param  {String} [config]  - Path to the requirejs config (to avoid recomputing all driver scripts)
 */
module.exports = function(file, root, cb, config) {
  var drivers;

  if (!file)  throw new Error('file not given');
  if (!root)  throw new Error('root location not given');
  if (!cb)    throw new Error('callback not given');

  file = path.resolve(process.cwd(), file);

  if (config) {
    drivers = getModulesToBuild(config);
    drivers = resolvePaths(drivers, root);

    drivers = drivers.map(function(driver) {
      return driver.indexOf('.js') === -1 ?
             driver + '.js' :
             driver;
    });

    findRelatedDrivers(drivers, file, root).then(cb);

  } else {
    getDriverScripts(root, function(drivers) {
      // console.log('DEDUCED DRIVERS: ', drivers)
      findRelatedDrivers(drivers, file, root).then(cb);
    });
  }
};

/**
 * Finds the driver scripts from the list that depend on the given
 * file (at some point in the dependency tree)
 * @param  {String[]} drivers
 * @param  {String} filename
 * @param  {String} root
 * @return {Promise} Resolves with a list of the relevant driver scripts
 */
function findRelatedDrivers(drivers, filename, root) {
  return getTrees(drivers, root)
    .then(function(results) {
      var relatedDrivers = [];

      results.forEach(function(treeList, idx) {
        if (treeList.indexOf(filename) !== -1) {
          relatedDrivers.push(drivers[idx]);
        }
      });

      return relatedDrivers;
    });
}

/**
 * Gets the dependency tree for each of the given files
 * @param  {String[]} drivers
 * @return {Promise} Resolves with a list of trees for each file in the list
 */
function getTrees(drivers, root) {
  return q.all(drivers.map(function(driver) {
    var deferred = q.defer();

    getTreeAsList(driver, root, deferred.resolve.bind(deferred));

    return deferred.promise;
  }));
}

function resolvePaths(drivers, root) {
  return drivers.map(function(name) {
    return path.resolve(root, name);
  });
}
