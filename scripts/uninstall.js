#! /usr/bin/env node
var fs = require("fs");
var path = require("path");
var readline = require("readline");
var chalk = require("chalk");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var cwd = process.cwd();
var minifyJsPath = path.join(cwd, "..", "..", "hooks", "after_prepare", "ionic-minify.js");
var configFilePath = path.join(cwd, "..", "..", "hooks", "minify-conf.json");
fs.unlink(minifyJsPath, function (error) {
    if (error === undefined) {
        console.log(chalk.red("Cannot find hook to remove at " + minifyJsPath + ". It may already have been removed!"));
    }
});
rl.question("Do you want to keep your configuration file (Y/N)?[Y] ", function (answer) {
    if (answer.toUpperCase() === "N") {
        fs.unlinkSync(configFilePath);
        console.log(chalk.red("Configuration file was deleted..."));
    }
    console.log(chalk.green("ionic-minify was uninstalled successfuly!"));
    process.exit(0);
});
