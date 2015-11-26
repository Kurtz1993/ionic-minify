#!/usr/bin/env node

var im = require('ionic-minify');
var path = require('path');

var hookConf = require("../minify-conf.json");
var cmd = process.env.CORDOVA_CMDLINE;
var rootDir = process.argv[2];
var minify = hookConf.alwaysRun || (cmd.indexOf("--release") > -1);
var platforms = process.env.CORDOVA_PLATFORMS.split(',');
var platformPath = path.join(rootDir, "platforms");

hookConf.showErrStack = (hookConf.showErrStack || false);
hookConf.jsOptions.fromString = true;

var ionicMinify = new im.Minifier(hookConf, platforms, platformPath);

if (minify) {
  console.log("Starting minifying your files...");
  ionicMinify.run();
}