#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var scriptPath = __dirname;
var packageDependencies = require('../package.json').dependencies;
var dependencies = [];

for(var dependency in packageDependencies){
	dependencies.push(dependency);
}

var paths = [path.join(cwd, '..', '..', 'hooks'), path.join(cwd, '..', '..', 'hooks', 'after_prepare')];
// If paths do not exist, make them.
for (var pathIndex in paths) {
	if (!fs.existsSync(paths[pathIndex])) {
		console.log('Creating directory: ', paths[pathIndex]);
		fs.mkdirSync(paths[pathIndex]);
	}
}

// Absolute location for ionic-minify.js and configuration files.
var minifyFilePath = path.join(cwd, 'after_prepare', 'ionic-minify.js');
var configFilePath = path.join(cwd, 'minify-conf.json');

// Copy ionic-minify file to hooks folder.
var minifyFile = fs.readFileSync(minifyFilePath);
var configFile = fs.readFileSync(configFilePath);
var minifyFileNewPath = path.join(paths[1], 'ionic-minify.js');
var configFileNewPath = path.join(paths[0], 'minify-conf.json');

console.log("Copying minifier file to project's hooks/after_prepare...");
fs.writeFileSync(minifyFileNewPath, minifyFile);
console.log("Copying configuration file to project's hooks/ folder...");
fs.writeFileSync(configFileNewPath, configFile);

// Move dependencies to the parent node_modules folder.
console.log('Moving dependencies to node_modules folder...');
dependencies.forEach(function(dependency){
	// Moves dependencies to node_modules folder.
	fs.renameSync(path.join(cwd, 'node_modules', dependency), path.join(cwd, '..', dependency));
});

console.log('Finished installing. Experience the awesomeness ;)');