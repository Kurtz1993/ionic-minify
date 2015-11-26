/**
 * @class Minifer
 * The ionic minify compressor class.
 */
import fs       = require("fs");
import path     = require("path");
import childPr  = require("child_process");
var ngAnnotate  = require("ng-annotate");
var UglifyJS    = require("uglify-js");
var CleanCss    = require("clean-css");
var mozjpeg     = require("mozjpeg-stream");
var optipng     = require("pngout-bin").path;
var exec        = childPr.execFile;

export class Minifier {
  private config: any;
  private platforms: string[];
  private basePath: string;
  private platformPaths: string[];
  private cssMinifer: any;
  /**
   * Creates a new ionicMinify compressor.
   * @param {HookConf} hookConf Ionic Minify configuration object.
   * @param {String} 
   */
  public constructor(hookConf: any, platforms: string[], basePath: string) {
    this.config = hookConf;
    this.platforms = platforms;
    this.basePath = basePath;
    this.cssMinifer = new CleanCss(this.config.cssOptions);
    this.platformPaths = [];
    this.setPlatformPaths();
    this.processFolders();
  }
  /**
   * Runs the compressor to minify files.
   */
  public run() {

  }
  
  /**
   * Set the paths for all the platforms that are going to be minified.
   */
  private setPlatformPaths() {
    this.platforms.forEach((platform) => {
      switch (platform) {
        case "android":
          this.platformPaths.push(path.join(this.basePath, platform, "assets", "www"));
          break;
        case "ios":
        case "wp8":
        case "browser":
          this.platformPaths.push(path.join(this.basePath, platform, "www"));
          break;
        default:
          console.log("Ionic minify supports Android, iOS, Windows Phone 8 and Browser only.");
          break;
      }
    });
  }
  
  /**
   * Process all directories specified in the configuration.
   */
  private processFolders() {
    this.platformPaths.forEach((platform) => {
      this.config.foldersToProcess.forEach((folder) => {
        this.processFiles(path.join(platform, folder));
      });
    });
  }

  /**
   * Process all the files in a directory.
   * @param {String} The directory that conttains the files to be processed.
   */
  private processFiles(dir: string) {
    fs.readdir(dir, (error, list) => {
      if (error) {
        console.log(`An error ocurred while reading directories: \n ${error}`);
        return;
      } else {
        list.forEach((file) => {
          file = path.join(dir, file);
          fs.stat(file, (err, stat) => {
            if (stat.isDirectory()){
              this.processFiles(file);  
            } else {
              this.compress(file);
            }
          });
        });
      }
    });
  }
  /**
   * Compress the specified file.
   * @param {String} file The file path.
   */
  private compress (file: string){
    var extension: string = path.extname(file);
    var fileName: string = path.basename(file);
    
    if (fileName.indexOf(".min.") > -1){
      extension = `.min${extension}`;
    }
    
    switch (extension){
      case ".js":
        try {
          var src: string = fs.readFileSync(file, "utf8");
          var ngSafeFile: any = ngAnnotate(src, {add: true});
          var result: any = UglifyJS.minify(ngSafeFile.src, this.config.jsOptions);
          fs.writeFileSync(file, result.code, "utf8");
          console.log(`JS file: ${fileName} has been minified!`);
        } catch (err) {
          console.log(`Minifying ${fileName} resulted in an error and won't be minified.`);
          if (this.config.showErrStack) {
            console.log(err.stack);
          }
        }
        break;
      case ".css":
        try {
          var src: string = fs.readFileSync(file, "utf8");
          var css: any    = this.cssMinifer.minify(src);
          css = (css.styles) ? css.styles : css;
          fs.writeFileSync(file, css, "utf8");
          console.log(`Css file: ${fileName} has been minified!`);
        } catch (err) {
          console.log(`Minifying ${fileName} resulted in an error and won't be minified.`);
          if (this.config.showErrStack) {
            console.log(err.stack);
          }
        }
        break;
      case ".jpg":
      case ".jpeg":
        var ws: fs.WriteStream;
        try {
          console.log(`Compressing image: ${fileName}`);
          fs.createReadStream(file)
            .pipe(mozjpeg(this.config.jpgOptions))
            .pipe(ws = fs.createWriteStream(`${file}.jpg`));
          ws.on("finish", () => {
            fs.unlinkSync(file);
            fs.renameSync(`${file}.jpg`, file);
            console.log(`Finished compressing image: ${fileName}`);
          });
        } catch (err){
          console.log(`Compressing ${fileName} resulted in an error and won't be compressed.`);
        }
        break;
      case ".png":
        try {
          console.log(`Compressing image: ${fileName}`);
          exec(optipng, [file, `${file}.png`, "-s0", "-k0", "-f0"], (err) => {
            if (err) {
              console.log(`An error has ocurred: ${err}`);
            } else {
              fs.unlinkSync(file);
              fs.renameSync(`${file}.png`, file);
              console.log(`Finished compressing image: ${fileName}`);
            }
          });
        } catch (err){
          console.log(`Compressing ${fileName} resulted in an error and won't be compressed.`);
        }
        break;
      default:
        break;
    }
  }
}