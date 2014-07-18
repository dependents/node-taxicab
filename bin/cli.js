#!/usr/bin/env node

'use strict';

var findDriver = require('../'),
    filename = process.argv[2],
    root     = process.argv[3],
    config   = process.argv[4];

try {
  findDriver(filename, root, function(drivers) {
    drivers.forEach(function(driver) {
      console.log(driver);
    });
  },
  config);
} catch (e) {
  console.log(e);
}
