### TaxiCab

> Find the driver script(s) that depend on the current module

`npm install taxicab`

### Usage

```js
var taxicab = require('taxicab');

taxicab(file, root, function(drivers) {

});
```

You may optionally supply a 4th argument that's the path to your requirejs configuration file.

If supplied, [get-modules-to-build](https://github.com/mrjoelkemp/node-get-modules-to-build) is used to look up
the driver scripts. Otherwise, the driver scripts are computed via [amd-driver-scripts](https://github.com/mrjoelkemp/node-amd-driver-scripts).


Usage via the shell (assumes a global install `npm install -g taxicab`)

```
taxicab filename root [config]
```

Prints:

```
/a.js
/b.js
```


