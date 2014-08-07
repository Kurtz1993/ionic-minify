#!/usr/bin/env node

// After-uninstall script to remove the minify.js script from the user's hooks/after_prepare directory

var fs = require('fs'), path = require('path'), cwd = process.cwd();

var minifyJsPath = path.join(cwd, '..', '..', 'hooks', 'after_prepare', 'cordova-minify.js');

fs.unlink(minifyJsPath, function(error){
    if(error == undefined){
        console.log('Uninstalled hooks: ', minifyJsPath);
    }else{
        console.log('Cannot find hook to remove at ' + minifyJsPath + '. It may already have been removed!');
    }
});
console.log('Uninstalled cordova-minify. We are sad to see you go! See you soon!');