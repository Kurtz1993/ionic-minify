#!/usr/bin/env node

import path       = require("path");
import im         = require("ionic-minify");

var config: IHookConfig = require("../minify-conf.json");
var cmd: string         = process.env.CORDOVA_CMDLINE;
var rootDir: string     = process.argv[2];
var minify: boolean     = config.alwaysRun || (cmd.indexOf("--release") > -1);
var platforms: string[] = process.env.CORDOVA_PLATFORMS.split(',');
var platformPath: string= path.join(rootDir, "platforms");

config.showErrStack = (config.showErrStack || false);
config.jsOptions.fromString = true;

var ionicMinify: im.Minifier = new im.Minifier(config, platforms, platformPath);

if (minify) {
  console.log("Starting minifying your files...");
  ionicMinify.run();
}