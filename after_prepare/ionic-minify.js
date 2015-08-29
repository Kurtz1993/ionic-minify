#!/usr/bin/env node
var hookConf  = require('../minify-conf.json');
var cmd       = process.env.CORDOVA_CMDLINE;
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
var mozjpeg       = require('mozjpeg-stream');
var optipng       = require('pngout-bin').path;
var spawn         = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn
var exec          = require('child_process').execFile;

// Process variables
var rootDir           = process.argv[2];
var platformPath      = path.join(rootDir, 'platforms');
var platforms         = process.env.CORDOVA_PLATFORMS.split(',');
var foldersToProcess  = hookConf.foldersToProcess;
var cssMinifier       = new CleanCSS(hookConf.cssOptions);
var ws                = null;

console.log('Starting minifying your files...');

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
      console.log('ionic-minify currently suports Android, iOS and browser only.');
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
      console.log('Minifying JS file: ' + fileName);
      var ngSafeFile = ngAnnotate(String(fs.readFileSync(file)), { add: true });
      var result = UglifyJS.minify(ngSafeFile.src, hookConf.jsOptions);
      fs.writeFileSync(file, result.code, 'utf8');
      break;
    case '.css':
      console.log('Minifying CSS file: ' + fileName);
      var source = fs.readFileSync(file, 'utf8');
      var css = cssMinifier.minify(source);
      css = css.styles ? css.styles : css;
      fs.writeFileSync(file, css, 'utf8');
      break;
    case '.jpg':
    case '.jpeg':
      console.log('Compressing JPG image: ' + fileName);
      fs.createReadStream(file)
        .pipe(mozjpeg(hookConf.jpgOptions))
        .pipe(ws = fs.createWriteStream(file + '.jpg'));
      ws.on('finish', function(){
        fs.unlinkSync(file);
        fs.renameSync(file + '.jpg', file);
        console.log("Finished compressing JPG image: " + fileName);
      });
      break;
    case '.png':
      console.log('Compressing PNG image: ' + fileName);
      exec(optipng, [file, file + '.png', '-s0', '-k0', '-f0'], function(err){
        if (err){
          console.log("An error has ocurred: " + err);
        } else{
          fs.unlinkSync(file);
          fs.renameSync(file + '.png', file);
          console.log("Finished compressing PNG image:  " + fileName);
        }
      });
      break;
    default:
      console.log(extension + ' file found, not minifying...');
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
      console.log('An error has occured while reading directories: ' + error);
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
