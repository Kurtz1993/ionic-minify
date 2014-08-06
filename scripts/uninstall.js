#!/usr/bin/env node

// After-uninstall script to remove the minify.js script from the user's hooks/after_prepare directory

var fs = require('fs'), path = require('path'), cwd = process.cwd();

var minifyJsPath = path.join(cwd, '..', '..', 'hooks', 'after_prepare', 'minify.js');

fs.unlink(minifyJsPath);
console.log('Uninstalled hooks: ', minifyJsPath);
console.log('Uninstalled cordova-minify. We are sad to see you go! See you soon!');