#!/usr/bin/env node

import * as path from "path";
import {Minifier} from "ionic-minify";

let config: IMConfig    = require("../minify-conf.json");
let minify: boolean     = config.alwaysRun;
let cmd: string         = process.env.CORDOVA_CMDLINE;
let rootDir: string     = process.argv[2];
let platforms: string[] = process.env.CORDOVA_PLATFORMS.split(',');
let platformPath: string= path.join(rootDir, "platforms");

if(cmd.indexOf("--release") > -1 || cmd.indexOf("--minify") > -1) {
  if(cmd.indexOf("--release") > -1) {
    console.log("WARN: The use of the --release flag is deprecated!! Use --minify instead!");
  }
  minify = true;
}

config.showErrStack = (config.showErrStack || false);
config.jsOptions.fromString = true;

if (minify === true) {
  let ionicMinify: Minifier = new Minifier(config, platforms, platformPath);
  console.log("Starting minifying your files...");
  ionicMinify.run();
}