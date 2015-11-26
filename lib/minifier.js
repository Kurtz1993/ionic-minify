var fs = require("fs");
var path = require("path");
var childPr = require("child_process");
var ngAnnotate = require("ng-annotate");
var UglifyJS = require("uglify-js");
var CleanCss = require("clean-css");
var mozjpeg = require("mozjpeg-stream");
var optipng = require("pngout-bin").path;
var exec = childPr.execFile;
var Minifier = (function () {
    function Minifier(hookConf, platforms, basePath) {
        this.config = hookConf;
        this.platforms = platforms;
        this.basePath = basePath;
        this.cssMinifer = new CleanCss(this.config.cssOptions);
        this.platformPaths = [];
        this.setPlatformPaths();
        this.processFolders();
    }
    Minifier.prototype.run = function () {
    };
    Minifier.prototype.setPlatformPaths = function () {
        var _this = this;
        this.platforms.forEach(function (platform) {
            switch (platform) {
                case "android":
                    _this.platformPaths.push(path.join(_this.basePath, platform, "assets", "www"));
                    break;
                case "ios":
                case "wp8":
                case "browser":
                    _this.platformPaths.push(path.join(_this.basePath, platform, "www"));
                    break;
                default:
                    console.log("Ionic minify supports Android, iOS, Windows Phone 8 and Browser only.");
                    break;
            }
        });
    };
    Minifier.prototype.processFolders = function () {
        var _this = this;
        this.platformPaths.forEach(function (platform) {
            _this.config.foldersToProcess.forEach(function (folder) {
                _this.processFiles(path.join(platform, folder));
            });
        });
    };
    Minifier.prototype.processFiles = function (dir) {
        var _this = this;
        fs.readdir(dir, function (error, list) {
            if (error) {
                console.log("An error ocurred while reading directories: \n " + error);
                return;
            }
            else {
                list.forEach(function (file) {
                    file = path.join(dir, file);
                    fs.stat(file, function (err, stat) {
                        if (stat.isDirectory()) {
                            _this.processFiles(file);
                        }
                        else {
                            _this.compress(file);
                        }
                    });
                });
            }
        });
    };
    Minifier.prototype.compress = function (file) {
        var extension = path.extname(file);
        var fileName = path.basename(file);
        if (fileName.indexOf(".min.") > -1) {
            extension = ".min" + extension;
        }
        switch (extension) {
            case ".js":
                try {
                    var src = fs.readFileSync(file, "utf8");
                    var ngSafeFile = ngAnnotate(src, { add: true });
                    var result = UglifyJS.minify(ngSafeFile.src, this.config.jsOptions);
                    fs.writeFileSync(file, result.code, "utf8");
                    console.log("JS file: " + fileName + " has been minified!");
                }
                catch (err) {
                    console.log("Minifying " + fileName + " resulted in an error and won't be minified.");
                    if (this.config.showErrStack) {
                        console.log(err.stack);
                    }
                }
                break;
            case ".css":
                try {
                    var src = fs.readFileSync(file, "utf8");
                    var css = this.cssMinifer.minify(src);
                    css = (css.styles) ? css.styles : css;
                    fs.writeFileSync(file, css, "utf8");
                    console.log("Css file: " + fileName + " has been minified!");
                }
                catch (err) {
                    console.log("Minifying " + fileName + " resulted in an error and won't be minified.");
                    if (this.config.showErrStack) {
                        console.log(err.stack);
                    }
                }
                break;
            case ".jpg":
            case ".jpeg":
                var ws;
                try {
                    console.log("Compressing image: " + fileName);
                    fs.createReadStream(file)
                        .pipe(mozjpeg(this.config.jpgOptions))
                        .pipe(ws = fs.createWriteStream(file + ".jpg"));
                    ws.on("finish", function () {
                        fs.unlinkSync(file);
                        fs.renameSync(file + ".jpg", file);
                        console.log("Finished compressing image: " + fileName);
                    });
                }
                catch (err) {
                    console.log("Compressing " + fileName + " resulted in an error and won't be compressed.");
                }
                break;
            case ".png":
                try {
                    console.log("Compressing image: " + fileName);
                    exec(optipng, [file, (file + ".png"), "-s0", "-k0", "-f0"], function (err) {
                        if (err) {
                            console.log("An error has ocurred: " + err);
                        }
                        else {
                            fs.unlinkSync(file);
                            fs.renameSync(file + ".png", file);
                            console.log("Finished compressing image: " + fileName);
                        }
                    });
                }
                catch (err) {
                    console.log("Compressing " + fileName + " resulted in an error and won't be compressed.");
                }
                break;
            default:
                break;
        }
    };
    return Minifier;
})();
exports.Minifier = Minifier;
