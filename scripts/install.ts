#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
import * as shell from "shelljs";

let packageDependencies: string[] = require("../package.json").dependencies;
let cwd: string             = process.cwd();
let scriptPath: string      = __dirname;
let paths: string[]         = [path.join(cwd, "..", "..", "hooks"), path.join(cwd, "..", "..", "hooks", "after_prepare")];
let dependencies: string[]  = [];
let stat: fs.Stats          = null;

// Detect dependencies.
for (let dependency in packageDependencies) {
	dependencies.push(dependency);
}

// If paths do not exist, make them.
paths.forEach((folder) => {
	try {
		stat = fs.statSync(folder);
	} catch (err) {
		if (err.code === "ENOENT") {
			console.log(chalk.yellow.bold(`Creating directory: ${folder}`));
			fs.mkdirSync(folder);
		}
	}
});

// Absolute location for ionic-minify.js and configuration files.
let minifyFilePath: string = path.join(cwd, "after_prepare", "ionic-minify.js");
let configFilePath: string = path.join(cwd, "minify-conf.json");

// Copy ionic-minify file to hooks folder.
let minifyFile: string = fs.readFileSync(minifyFilePath, "utf8");
let configFile: string = fs.readFileSync(configFilePath, "utf8");
let minifyFileNewPath: string = path.join(paths[1], "ionic-minify.js");
let configFileNewPath: string = path.join(paths[0], "minify-conf.json");

console.log(chalk.cyan("Copying minifier file to project's hooks/after_prepare..."));
fs.writeFileSync(minifyFileNewPath, minifyFile);

// Create configuration file only if it doesn't exist
try{
	stat = fs.statSync(configFileNewPath);
  console.log(chalk.yellow("You already have a minify-conf.json file..."));
}
catch(err){
	if(err.code === "ENOENT"){
	  console.log(chalk.cyan("Copying configuration file to project's hooks/ folder..."));
    fs.writeFileSync(configFileNewPath, configFile);
	}
}

console.log(chalk.cyan("Updating hooks directory to have execution permissions..."));
shell.chmod("-R", 755, paths[0]);

// Move dependencies to the parent node_modules folder.
dependencies.forEach((dependency) => {
	// Moves dependencies to node_modules folder.
	try {
		stat = fs.statSync(path.join(cwd, "..", dependency));
		console.log(chalk.yellow(`It appears that you have already installed ${dependency}...`));
	} catch (err) {
		if ((dependency !== "chalk" && dependency !== "shelljs") && err.code === "ENOENT") {
			console.log(chalk.blue(`Copying ${dependency} to your node_modules/ folder...`));
			fs.renameSync(path.join(cwd, "node_modules", dependency), path.join(cwd, "..", dependency));
		}
	}
});
console.log(chalk.green.bold("Ionic minify has been installed successfully! :)"));
