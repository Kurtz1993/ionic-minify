#!/usr/bin/env node

// Modules
var fs        = require('fs')
var path      = require('path')
var readline  = require('readline');
var rl        = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
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

rl.question('Do you want to keep your configuration file (Y/N)?[Y] ', function (answer){
  if(answer.toUpperCase() === 'N'){
    console.log("Deleting configuration file...");
    fs.unlinkSync(configFilePath);
  }
  console.log('ionic-minify was uninstalled successfuly!');
  process.exit(0);
});