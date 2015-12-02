#!/usr/bin/env node
var path = require("path");
var im = require("ionic-minify");
var config = require("../minify-conf.json");
var cmd = process.env.CORDOVA_CMDLINE;
var rootDir = process.argv[2];
var minify = config.alwaysRun || (cmd.indexOf("--release") > -1);
var platforms = process.env.CORDOVA_PLATFORMS.split(',');
var platformPath = path.join(rootDir, "platforms");
config.showErrStack = (config.showErrStack || false);
config.jsOptions.fromString = true;
var ionicMinify = new im.Minifier(config, platforms, platformPath);
if (minify) {
    console.log("Starting minifying your files...");
    ionicMinify.run();
}
