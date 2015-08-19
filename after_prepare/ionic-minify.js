#!/usr/bin/env node
var hookConf  = require('../minify-conf.json');
var cmd       = process.env.CORDOVA_CMDLINE;
//var cmd = ''; 
var isRelease = (cmd.indexOf('--release') > -1);

if(!isRelease){
  // If it's not release, exit.
  return;
}

// Modules
var fs            = require('fs');
var path          = require('path');
var UglifyJS      = require('uglify-js');
var CleanCSS      = require('clean-css');
var ngAnnotate    = require('ng-annotate');
var chalk         = require('chalk');

// Process variables
var rootDir           = process.argv[2];
var platformPath      = path.join(rootDir, 'platforms');
var platforms         = process.env.CORDOVA_PLATFORMS.split(',');
var foldersToProcess  = hookConf.foldersToProcess;
var cssMinifier       = new CleanCSS(hookConf.cssOptions);

console.log(chalk.white('Starting minifying your files...'));

// Specify the www folder for each platform in the command.
platforms.forEach(function (platform) {
  switch (platform) {
    case 'android':
      platformPath = path.join(platformPath, platform, 'assets', 'www');
      break;
    case 'ios':
    case 'browser':
      platformPath = path.join(platformPath, platform, 'www');
      break;
    default:
      console.log(chalk.yellow('ionic-minify currently suports Android, iOS and browser only.'));
      return;
  }
});

/*
 * Compresses a file.
 * @param {string} file - This is the file path.
 */
var compress = function (file) {
  var extension = path.extname(file);
  var fileName = path.basename(file);
  if (fileName.indexOf('.min.') > -1) {
    extension = '.min' + extension;
  }

  switch (extension) {
    case '.js':
      console.log(chalk.yellow('Minifying JS file: ') + chalk.yellow.bold(fileName));
      (hookConf.jsOptions.outSourceMap ? hookConf.jsOptions.outSourceMap = file : null);
      var ngSafeFile = ngAnnotate(String(fs.readFileSync(file)), { add: true });
      var result = UglifyJS.minify(ngSafeFile.src, hookConf.jsOptions);
      fs.writeFileSync(file, result.code, 'utf8');
      if (result.map) {
        console.log(chalk.yellow.bold('Creating map file: ' + fileName + '.map'));
        fs.writeFileSync(file + '.map', result.map, 'utf8');
      }
      break;
    case '.css':
      console.log(chalk.cyan('Minifying CSS file: ' + fileName));
      var source = fs.readFileSync(file, 'utf8');
      var result = cssMinifier.minify(source);
      fs.writeFileSync(file, result.styles, 'utf8');
      if (result.sourceMap) {
        console.log(chalk.cyan.bold('Creating map file: ' + fileName + '.map'));
        fs.writeFileSync(file + '.map', result.sourceMap, 'utf8');
      }
      break;
    default:
      console.log(chalk.magenta(extension + ' file found, not minifying...'));
      break;
  }
};

/*
 * Processes all the files in a directory.
 * @params {string} dir - This is the directory that contains the files to be processed.
*/
var processFiles = function (dir) {
  fs.readdir(dir, function (error, list) {
    if (error) {
      console.log(chalk.red.bold('An error has occured while reading directories: ' + error));
      return;
    }
    list.forEach(function (file) {
      file = path.join(dir, file);
      if (dir.indexOf('ionic') === -1) {
        fs.stat(file, function (err, stat) {
          if (stat.isDirectory()) {
            processFiles(file);
          } else {
            compress(file);
          }
        });
      }
    });
  });
};

/*
 * Processes all the directories specified in the configuration file.
 * @param {string} platformWww - This is the complete path of the www folder of the platform.
*/
var processFolders = function (platformWww) {
  foldersToProcess.forEach(function (folder) {
    processFiles(path.join(platformWww, folder));
  });
};

processFolders(platformPath);