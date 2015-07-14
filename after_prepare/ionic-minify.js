#!/usr/bin/env node

var cliCommand = process.env.CORDOVA_CMDLINE;
var isRelease = true; // Uncomment this to always minify files...

//var isRelease = (cliCommand.indexOf('--release') > -1);
if (!isRelease) {
  return;
}

var fs = require('fs');
var path = require('path');
var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');
var ngAnnotate = require('ng-annotate');
var cssMinifier = new CleanCSS({
  keepSpecialComments: 0
});

var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platform = process.env.CORDOVA_PLATFORMS;
console.log('Minifying your files...');


function processFiles(dir) {
  fs.readdir(dir, function (err, list) {
    if (err) {
      console.log('processFiles - reading directories error: ' + err);
      return;
    }
    list.forEach(function (file) {
      file = path.join(dir, file);
      if (dir.indexOf('ionic') === -1 || dir.indexOf('ionic') === -1) {
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
}

function compress(file) {
  var ext = path.extname(file);
  var fileName = path.basename(file);
  if (fileName.indexOf('.min.') > -1) {
    ext = '.min' + ext;
  }
  switch (ext) {
    case '.js':
      console.log('Minifying JS File: ' + fileName);
      var res = ngAnnotate(String(fs.readFileSync(file)), { add: true });
      var result = UglifyJS.minify(res.src, {
        compress: { // pass false here if you only want to minify (no obfuscate)
          drop_console: true // remove console.* statements (log, warn, etc.)
        },
        fromString: true
      });
      fs.writeFileSync(file, result.code, 'utf8'); // overwrite the original unminified file
      break;
    case '.css':
      console.log('Minifying CSS File: ' + fileName);
      var source = fs.readFileSync(file, 'utf8');
      var result = cssMinifier.minify(source);
      fs.writeFileSync(file, result, 'utf8'); // overwrite the original unminified file
      break;
    default:
      console.log('Got file with ' + ext + ' extension - not minifying.');
      break;
  }
}

switch (platform) {
  case 'android':
    platformPath = path.join(platformPath, platform, "assets", "www");
    break;
  case 'ios':
    platformPath = path.join(platformPath, platform, "www");
    break;
  default:
    console.log('This hook only works with Android and iOS.');
    return;
}

var foldersToProcess = ['js', 'css', 'lib'];

foldersToProcess.forEach(function (folder) {
  processFiles(path.join(platformPath, folder));
});
