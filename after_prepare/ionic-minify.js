#!/usr/bin/env node

var cliCommand = process.env.CORDOVA_CMDLINE;
//var isRelease = true;

var isRelease = (cliCommand.indexOf('--release') > -1); // comment the above line and uncomment this line to turn the hook on only for release
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
console.log('cordova-minify STARTING - minifying your js, css, and images. Sit back and relax!');


function processFiles(dir) {
    fs.readdir(dir, function (err, list) {
        if (err) {
            console.log('processFiles - reading directories error: ' + err);
            return;
        }
        list.forEach(function(file) {
            file = path.join(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat.isDirectory()) {
                    processFiles(file);
                } else{
                    compress(file); 
                }
            });
        });
    });
}

function compress(file) {
    var ext = path.extname(file);
    switch(ext) {
        case '.js':
            console.log('Minifying JS File: ' + file);
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
            console.log('Minifying CSS File: ' + file);
            var source = fs.readFileSync(file, 'utf8');
            var result = cssMinifier.minify(source);
            fs.writeFileSync(file, result, 'utf8'); // overwrite the original unminified file
            break;
        default:
            console.log('Encountered file with ' + ext + ' extension - not compressing.');
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
        console.log('Hook currently supports only Android and iOS');
        return;
}

var foldersToProcess = ['js', 'css'];

foldersToProcess.forEach(function(folder) {
    processFiles(path.join(platformPath, folder));

});
