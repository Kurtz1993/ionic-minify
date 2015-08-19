#!/usr/bin/env node

var fs		= require('fs');
var path	= require('path');
var chalk	=	require('chalk');

//Directories and configurations.
var cwd									= process.cwd();
var scriptPath					= __dirname;
var paths 							= [path.join(cwd, '..', '..', 'hooks'), path.join(cwd, '..', '..', 'hooks', 'after_prepare')];
var packageDependencies	= require('../package.json').dependencies;
var dependencies				= [];
var stat								=	null;

// Detect dependencies.
for (var dependency in packageDependencies) {
	dependencies.push(dependency);
}

// If paths do not exist, make them.
paths.forEach(function (folder) {
	try {
		stat = fs.statSync(folder);
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.log(chalk.white.bold('Creating directory: ' + folder));
			fs.mkdirSync(folder);
		}
	}
});

// Absolute location for ionic-minify.js and configuration files.
var minifyFilePath = path.join(cwd, 'after_prepare', 'ionic-minify.js');
var configFilePath = path.join(cwd, 'minify-conf.json');

// Copy ionic-minify file to hooks folder.
var minifyFile = fs.readFileSync(minifyFilePath);
var configFile = fs.readFileSync(configFilePath);
var minifyFileNewPath = path.join(paths[1], 'ionic-minify.js');
var configFileNewPath = path.join(paths[0], 'minify-conf.json');

console.log(chalk.white.bold("Copying minifier file to project's hooks/after_prepare..."));
fs.writeFileSync(minifyFileNewPath, minifyFile);
console.log(chalk.white.bold("Copying configuration file to project's hooks/ folder..."));
fs.writeFileSync(configFileNewPath, configFile);

// Move dependencies to the parent node_modules folder.
dependencies.forEach(function (dependency) {
	// Moves dependencies to node_modules folder.
	try {
		stat = fs.statSync(path.join(cwd, '..', dependency));
		console.log(chalk.green("It appears that you have already installed ") + chalk.green.bold(dependency) + '...');
	} catch (err) {
		if (err.code === 'ENOENT') {
			fs.renameSync(path.join(cwd, 'node_modules', dependency), path.join(cwd, '..', dependency));
			console.log(chalk.white("Copying ") + chalk.white.bold(dependency) + chalk.white(' to your node_modules/ folder...'));
		}
	}
});


console.log(chalk.blue.bold('Finished installing. Experience the awesomeness ;)'));