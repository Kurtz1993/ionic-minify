#!/usr/bin/env node
/*
 * Deletes ionic-minify.js hook and it's configuration file
 *
*/

// Modules
var fs    = require('fs')
var path  = require('path')

// Directories
var cwd             = process.cwd();
var minifyJsPath    = path.join(cwd, '..', '..', 'hooks', 'after_prepare', 'ionic-minify.js');
var configFilePath  = path.join(cwd, '..', '..', 'hooks', 'minify-conf.json');

// Delete ionic-minify.js
fs.unlink(minifyJsPath, function (error) {
  if (error === undefined) {
    console.log('Cannot find hook to remove at ' + minifyJsPath + '. It may already have been removed!');
  }
});

// Delete minify-conf.json
fs.unlink(configFilePath, function (error) {
  if (error === undefined) {
    console.log('Cannot find the configuration file at ' + configFilePath + '. It may already have been removed!');
  }
});
console.log('Uninstalled successfuly!');