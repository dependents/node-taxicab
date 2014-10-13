### TaxiCab [![npm](http://img.shields.io/npm/v/taxicab.svg)](https://npmjs.org/package/taxicab) [![npm](http://img.shields.io/npm/dm/taxicab.svg)](https://npmjs.org/package/taxicab)

> Find a driver

`npm install -g taxicab`

Finds the driver script(s) that depend on a given module. This is helpful if you'd like to see which apps
are affected by changes to a single module.

### Usage

```js
var findDriver = require('taxicab');

findDriver({
  file: 'path/to/a/js/file',
  directory: 'path/to/all/js,
  success: function(err, drivers) {
    console.log(drivers);
  }
});
```

* You may pass additional options supported by [`get-driver-scripts`](https://github.com/mrjoelkemp/node-get-driver-scripts)
to handle pulling driver scripts from a RequireJS build config or resolving aliased
paths via a requirejs config.

Shell usage:

`taxicab filename directory [buildConfig]`

Prints:

```
path/to/a.js
path/to/b.js
```