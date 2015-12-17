/**
 * @class Minifer
 * The ionic minify compressor class.
 */
import * as fs from 'fs';
import * as path from 'path';
import {execFile as exec} from 'child_process';
let ngAnnotate: any  = require("ng-annotate");
let UglifyJS: any    = require("uglify-js");
let CleanCss: any    = require("clean-css");
let mozjpeg: any     = require("mozjpeg-stream");
let optipng: string  = require("pngout-bin").path;

export class Minifier {
  private config: IHookConfig;
  private platforms: string[];
  private basePath: string;
  private platformPaths: string[];
  private cssMinifer: any;
  
  /**
   * Creates a new ionicMinify compressor.
   * @param {HookConf} hookConf Ionic Minify configuration object.
   * @param {String} 
   */
  public constructor(hookConf: IHookConfig, platforms: string[], basePath: string) {
    this.config = hookConf;
    this.platforms = platforms;
    this.basePath = basePath;
    this.cssMinifer = new CleanCss(this.config.cssOptions);
    this.platformPaths = [];
    this.setPlatformPaths();
  }
  
  /**
   * Runs the compressor to minify files.
   */
  public run() {
    this.platformPaths.forEach((platform) => {
      this.config.foldersToProcess.forEach((folder) => {
        this.processFiles(path.join(platform, folder));
      });
    });
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
   * Process all the files in a directory.
   * @param {string} dir The directory that conttains the files to be processed.
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
   * @param {string} file The file path.
   */
  private compress (file: string){
    let extension: string = path.extname(file);
    let fileName: string = path.basename(file);
    let src: any;
    
    if (fileName.indexOf(".min.") > -1){
      extension = `.min${extension}`;
    }
    
    switch (extension){
      case ".js":
        try {
          src = fs.readFileSync(file, "utf8");
          let ngSafeFile: any = ngAnnotate(src, {add: true});
          let result: any = UglifyJS.minify(ngSafeFile.src, this.config.jsOptions);
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
          src= fs.readFileSync(file, "utf8");
          let css: any    = this.cssMinifer.minify(src);
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
      case ".png":
        this.compressImage(file, fileName, extension);
        break;
      default:
        break;
    }
  }
  
  /**
   * Compress an image (PNG or JPG).
   * @param {String} file - The path of the file to compress.
   * @param {String} fileName - The name of the file.
   * @param {String} ext - The extension of the image.
   */
  private compressImage(file: string, fileName: string, ext: string) {
    try {
      console.log(`Compressing image: ${fileName}`);
      if(ext === '.jpg' || ext === '.jpeg') {
        let ws: fs.WriteStream;
        fs.createReadStream(file)
            .pipe(mozjpeg(this.config.jpgOptions))
            .pipe(ws = fs.createWriteStream(`${file}.jpg`));
          ws.on("finish", () => {
            fs.unlinkSync(file);
            fs.renameSync(`${file}.jpg`, file);
            console.log(`Finished compressing image: ${fileName}`);
          });
      }
      else if(ext === '.png') {
        exec(optipng, [file, `${file}.png`, "-s0", "-k0", "-f0"], (err) => {
          if (err) {
            console.log(`An error has ocurred: ${err}`);
          } else {
            fs.unlinkSync(file);
            fs.renameSync(`${file}.png`, file);
            console.log(`Finished compressing image: ${fileName}`);
          }
        });
      }
    } catch (err){
      console.log(`Compressing ${fileName} resulted in an error and won't be compressed.`);
    }
  }
}