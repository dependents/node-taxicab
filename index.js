var amdDriverScripts  = require('amd-driver-scripts'),
    getModulesToBuild = require('get-modules-to-build'),
    getTreeAsList     = require('dependency-tree').getTreeAsList,
    path              = require('path'),
    q                 = require('q'),
    Table             = require('cli-table'),
    timer             = require('node-tictoc');

/**
 * Gets the driver script(s) that depend on the given module
 * @param {Object}   options
 * @param {String}   options.filename  - The path of the module whose driver script should be found
 * @param {String}   options.root      - The path where all JS files are
 * @param {Function} options.success   - (String[]) Executed with the driver scripts that depend on the given file
 * @param {String}   [options.config]  - Path to the requirejs config (to avoid recomputing all driver scripts)
 */
module.exports = function(options) {
  if (!options.filename)  throw new Error('file not given');
  if (!options.root)      throw new Error('root location not given');
  if (!options.success)   throw new Error('callback not given');

  options.filename = path.resolve(process.cwd(), options.filename);

  getDriverScripts(options)
  .then(function(drivers) {
    options.drivers = drivers;
    return options;
  })
  .then(findRelatedDrivers)
  .done(options.success);
};

/**
 * Determines how long it takes to generate the dependency trees for each of the
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function timeToGenerateTrees(options) {
  var table = new Table({
      head: ['Module', 'Tree time (ms)'],
      colWidths: [50, 20]
  });

  options.profile = true;
  options.table = table;

  getTrees(options)
  .then(function() {
    console.log(table.toString());
  });
}

/**
 *
 * @param  {Options} options
 * @param  {Options} options.root
 * @param  {Options} options.config
 * @return {Promise} (String[]) => null - Resolves with a list of driver scripts
 */
function getDriverScripts(options) {
  var deferred = q.defer();

  if (options.config) {
    deferred.resolve(getConfigDrivers(options.root, options.config));

  } else {
    amdDriverScripts(options.root, function(drivers) {
      deferred.resolve(drivers);
    });
  }

  return deferred.promise;
}

/**
 * Get the driver scripts from a requirejs configuration file
 * @param  {String} root
 * @param  {String} configPath
 * @return {String[]}
 */
function getConfigDrivers(root, configPath) {
  var drivers = getModulesToBuild(configPath);

  drivers = resolvePaths(drivers, root);

  drivers = drivers.map(function(driver) {
    return driver.indexOf('.js') === -1 ?
           driver + '.js' :
           driver;
  });

  return drivers;
}

/**
 * Finds the driver scripts from the list that depend on the given
 * file (at some point in the dependency tree)
 *
 * @param  {Object}   options
 * @param  {String[]} options.drivers
 * @param  {String}   options.filename
 * @param  {String}   options.root
 * @return {Promise}  Resolves with a list of the relevant driver scripts
 */
function findRelatedDrivers(options) {
  return q().then(function() {
    return options;
  })
  .then(getTrees)
  .then(function(trees) {
    options.trees = trees;
    return options;
  })
  .then(function() {
    var relatedDrivers = [];

    options.trees.forEach(function(treeList, idx) {
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
 * @param  {String}     options.root
 * @param  {Boolean}    options.profile - Whether or not to print profiling information
 * @param  {cli-table}  options.table   - Table instance for pretty output
 * @return {Promise}    (String[]) => null Resolves with a list of trees for each file in the list
 */
function getTrees(options) {
  return q.all(options.drivers.map(function(driver) {
    var deferred = q.defer(),
        time;

    if (options.profile) {
      timer.tic();
    }

    getTreeAsList(driver, options.root, deferred.resolve.bind(deferred));

    if (options.profile) {
      time = timer.toct();
      options.table.push([driver.split(options.root)[1], time.ms]);
    }

    return deferred.promise;
  }));
}

/**
 * Resolve each driver script path against the root
 * @param  {String[]} drivers
 * @param  {String} root
 * @return {String[]}
 */
function resolvePaths(drivers, root) {
  return drivers.map(function(name) {
    return path.resolve(root, name);
  });
}
