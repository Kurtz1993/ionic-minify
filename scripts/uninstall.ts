#! /usr/bin/env node

// Modules
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as chalk from 'chalk';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// Directories
let cwd: string             = process.cwd();
let minifyJsPath: string    = path.join(cwd, "..", "..", "hooks", "after_prepare", "ionic-minify.js");
let configFilePath: string  = path.join(cwd, "..", "..", "hooks", "minify-conf.json");

// Delete ionic-minify.js
fs.unlink(minifyJsPath, (error) => {
  if (error === undefined) {
    console.log(chalk.red("Cannot find hook to remove at " + minifyJsPath + ". It may already have been removed!"));
  }
});

// Delete minify-conf.json

rl.question("Do you want to keep your configuration file (Y/N)?[Y] ", (answer: string) => {
  if(answer.toUpperCase() === "N"){
    fs.unlinkSync(configFilePath);
    console.log(chalk.red("Configuration file was deleted..."));
  }
  console.log(chalk.green("ionic-minify was uninstalled successfuly!"));
  process.exit(0);
});