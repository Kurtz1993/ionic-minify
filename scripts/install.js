#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var scriptPath = __dirname;
var dependencies = ['clean-css', 'ng-annotate', 'uglify-js'];

var paths = [path.join(cwd, '..', '..', 'hooks'), path.join(cwd, '..', '..', 'hooks', 'after_prepare')];
fs.chmodSync(path.join(paths[1]), 755); // Resolve permissions issue in Linux and OSX.
// If paths do not exist, make them.
for (var pathIndex in paths) {
	if (!fs.existsSync(paths[pathIndex])) {
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
console.log('Moving dependencies to node_modules folder...');
for (var i in dependencies) {
	// Moves dependencies to node_modules folder.
	fs.renameSync(path.join(cwd, 'node_modules', dependencies[i]), path.join(cwd, '..', dependencies[i]));
}

console.log('Finished installing. Try running ionic build --release \n');
