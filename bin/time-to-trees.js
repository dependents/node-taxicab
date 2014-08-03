#!/usr/bin/env node

'use strict';

var trees     = require('../').timeToGenerateTrees,
    root      = process.argv[2],
    columnify = require('columnify');

try {
  trees({
    root: root,
    success: function(tableData) {
      console.log(columnify(tableData, {
        columns: ['Module', 'Time to Tree']
      }));
    }
  });
} catch (e) {
  console.log(e);
}
