#!/usr/bin/env node
var hookConf  = require('../minify-conf.json');
var cmd       = process.env.CORDOVA_CMDLINE;
var isRelease = hookConf.alwaysRun || (cmd.indexOf('--release') > -1);
hookConf.showErrStack = (hookConf.showErrStack || false);
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
var exec          = require('child_process').execFile;

// Process variables
var rootDir           = process.argv[2];
var platformPath      = path.join(rootDir, 'platforms');
var platforms         = process.env.CORDOVA_PLATFORMS.split(',');
var foldersToProcess  = hookConf.foldersToProcess;
var cssMinifier       = new CleanCSS(hookConf.cssOptions);
var ws                = null;

hookConf.jsOptions.fromString = true;

console.log('Starting minifying your files...');

// Specify the www folder for each platform in the command.
platforms.forEach(function (platform) {
  switch (platform) {
    case 'android':
      platformPath = path.join(platformPath, platform, 'assets', 'www');
      break;
    case 'ios':
    case 'wp8':
    case 'browser':
      platformPath = path.join(platformPath, platform, 'www');
      break;
    default:
      console.log('ionic-minify currently suports Android, iOS, Windows Phone 8 and browser only.');
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
      try {
        var src = fs.readFileSync(file, 'utf8');
        var ngSafeFile = ngAnnotate(src, { add: true });
        var result = UglifyJS.minify(ngSafeFile.src, hookConf.jsOptions);
        fs.writeFileSync(file, result.code, 'utf8');
        console.log('JS file: ' + fileName + " has been minified!");
      }
      catch (err) {
        console.log("Minifying " + fileName + " resulted in an error and won't be minified.");
        if(hookConf.showErrStack){
          console.log(err.stack);
        }
      }
      break;
    case '.css':
      try {
        var source = fs.readFileSync(file, 'utf8');
        var css = cssMinifier.minify(source);
        css = css.styles ? css.styles : css;
        fs.writeFileSync(file, css, 'utf8');
        console.log('CSS file: ' + fileName + " has been minified!  ");
      }
      catch (err) {
        console.log("Minifying " + fileName + "resulted in an error and won't be minified.");
        if(hookConf.showErrStack){
          console.log(err.stack);
        }
      }
      break;
    case '.jpg':
    case '.jpeg':
      try {
        console.log('Compressing JPG image: ' + fileName);
        fs.createReadStream(file)
          .pipe(mozjpeg(hookConf.jpgOptions))
          .pipe(ws = fs.createWriteStream(file + '.jpg'));
        ws.on('finish', function(){
          fs.unlinkSync(file);
          fs.renameSync(file + '.jpg', file);
          console.log("Finished compressing JPG image: " + fileName);
        });
      }
      catch (err) {
        console.log("Compressing " + fileName + " resulted in an error and won't be compressed.");
        if(hookConf.showErrStack){
          console.log(err.stack);
        }
      }
      break;
    case '.png':
      try{
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
      }
      catch (err) {
        console.log("Compressing " + fileName + " resulted in an error and won't be compressed.");
        if(hookConf.showErrStack){
          console.log(err.stack);
        }
      }
      break;
    default:
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
      fs.stat(file, function (err, stat) {
        if (stat.isDirectory()) {
          processFiles(file);
        } else if(dir.indexOf('ionic') === -1){
          compress(file);
        }
      });
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
