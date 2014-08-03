### TaxiCab

> A collection of helpful utilities for AMD modules

`npm install -g taxicab`

### Usage

Supported Commands:

1. [Find all driver scripts that depend on a module](#find-driver)
2. [How long does it take to compute the dependency trees about all modules in a directory](#time-to-trees)


##### find-driver

> Find the driver script(s) that depend on the given module

```js
var findDriver = require('taxicab').findDriver;

findDriver({
  file:   'file/in/question',
  root:   'path/to/all/js,
  config: 'path/to/my/requirejs/config.js', // Optional
  success: function(drivers) {
    console.log(drivers);
  }
});
```

* If `config` is supplied, [get-modules-to-build](https://github.com/mrjoelkemp/node-get-modules-to-build) is used to look up
the driver scripts. Otherwise, the driver scripts are computed via [amd-driver-scripts](https://github.com/mrjoelkemp/node-amd-driver-scripts).

Shell usage:

`find-driver filename root [config]`

Prints:

```
/a.js
/b.js
```

##### time-to-trees

> Get profiling data about how long it takes to generate the dependency trees for each module in a directory

```js
var timeToTree = require('taxicab').timeToGenerateTrees;

timeToTree({
  root:   'path/to/all/js,
  success: function(profileData) {
    console.log(profileData);
  }
});
```

Shell usage:

`time-to-tree root`

Prints via ([columnify](https://github.com/timoxley/columnify)):

```
a.js  200ms
b.js  100ms
```
