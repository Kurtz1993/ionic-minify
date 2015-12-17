#!/usr/bin/env node

import * as path from 'path';
import {Minifier} from 'ionic-minify';

let config: IMConfig = require("../minify-conf.json");
let cmd: string         = process.env.CORDOVA_CMDLINE;
let rootDir: string     = process.argv[2];
let minify: boolean     = config.alwaysRun || (cmd.indexOf("--release") > -1);
let platforms: string[] = process.env.CORDOVA_PLATFORMS.split(',');
let platformPath: string= path.join(rootDir, "platforms");

config.showErrStack = (config.showErrStack || false);
config.jsOptions.fromString = true;

let ionicMinify: Minifier = new Minifier(config, platforms, platformPath);

if (minify) {
  console.log("Starting minifying your files...");
  ionicMinify.run();
}