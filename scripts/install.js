#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var cwd = process.cwd(); // Current working directory is /project/node_modules/cordova-minify/
var scriptPath = __dirname;

var paths = [ path.join(cwd, '..', '..', 'hooks'), path.join(cwd, '..', '..', 'hooks', 'after_prepare') ];

// If paths do not exist, make them.
for(var pathIndex in paths) {
	if(!fs.existsSync(paths[pathIndex])) {
		console.log('Creating directory: ', paths[pathIndex]);
		fs.mkdirSync(paths[pathIndex]);
	}	
}

// Absolute Location of our cordova-minify.js file
var minifyFilePath = path.join(cwd, 'after_prepare', 'ionic-minify.js');

// Copy our minify script to the cordova hooks folder.
var minifyFile = fs.readFileSync(minifyFilePath);
var minifyFileNewPath = path.join(paths[1], 'minify.js');
console.log('Copying minifier file to Cordova hooks/after_prepare...');
fs.writeFileSync(minifyFileNewPath, minifyFile);

console.log('Finished installing. Try running ionic build --release \n');
console.log('You can check the script inside hooks/after_prepare so you can minify while developing too!');