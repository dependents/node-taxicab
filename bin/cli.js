#!/usr/bin/env node

'use strict';

var findDriver  = require('../').findDriver,
    filename    = process.argv[2],
    root        = process.argv[3],
    config      = process.argv[4];

try {
  findDriver({
    filename: filename,
    root: root || '',
    config: config || '',
    success: function(drivers) {
      drivers.forEach(function(driver) {
        console.log(driver);
      });
    }
  });
} catch (e) {
  console.log(e);
}
