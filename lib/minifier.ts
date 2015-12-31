import * as fs from 'fs';
import * as path from 'path';
import {execFile} from 'child_process';
let ngAnnotate: any  = require("ng-annotate");
let UglifyJS: any    = require("uglify-js");
let CleanCss: any    = require("clean-css");
let mozjpeg: any     = require("mozjpeg-stream");
let optipng: string  = require("pngout-bin").path;

export class Minifier {
  private config: IMConfig;
  private platforms: string[];
  private basePath: string;
  private platformPaths: string[];
  private cssMinifer: any;
  
  /**
   * Creates a new ionicMinify compressor.
   * @param {HookConf} hookConf - Ionic Minify configuration object.
   * @param {String[]} platforms - An array of the platforms to compress.
   * @param {String} basePath - The platforms base path.
   */
  public constructor(hookConf: IMConfig, platforms: string[], basePath: string) {
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
  public run(): void {
    this.platformPaths.forEach((platform) => {
      this.config.foldersToProcess.forEach((folder) => {
        this.processFiles(path.join(platform, folder));
      });
    });
  }
  
  /**
   * Set the paths for all the platforms that are going to be minified.
   */
  private setPlatformPaths(): void {
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
   * @param {string} dir - The directory that conttains the files to be processed.
   */
  private processFiles(dir: string): void {
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
   * @param {string} file - The file path.
   */
  private compress (file: string): void {
    let extension: string = path.extname(file);
    let fileName: string = path.basename(file);
    
    if (fileName.indexOf(".min.") > -1){
      extension = `.min${extension}`;
    }
    try {
      switch (extension){
        case ".js":
          this.compressJS(file, fileName);
            
          break;
        case ".css":
          this.compressCSS(file, fileName);
          break;
        case ".jpg":
        case ".jpeg":
          this.compressJPG(file, fileName);
          break;
        case ".png":
          this.compressPNG(file, fileName);
          break;
        default:
          break;
      }
    }
    catch(err) {
      console.log(`Compressing/Minifying ${fileName} resulted in an error and won't be compressed/minified.`);
      if (this.config.showErrStack) {
        console.log(err.stack);
      }
    }
  }
  /**
   * Compress a JavaScript file.
   * @param {String} file - The path of the file to compress.
   * @param {String} fileName - The name of the file.
   */
  private compressJS(file: string, fileName: string): void {
    let src: string = fs.readFileSync(file, "utf8");
    let ngSafeFile: any = ngAnnotate(src, {add: true});
    let result: any = UglifyJS.minify(ngSafeFile.src, this.config.jsOptions);
    fs.writeFileSync(file, result.code, "utf8");
    console.log(`JS file: ${fileName} has been minified!`);
  }
  /**
   * Compress a CSS file.
   * @param {String} file - The path of the file to compress.
   * @param {String} fileName - The name of the file.
   */
  private compressCSS(file: string, fileName: string): void {
    let src: string = fs.readFileSync(file, "utf8");
    let css: any = this.cssMinifer.minify(src);
    css = (css.styles) ? css.styles : css;
    fs.writeFileSync(file, css, "utf8");
    console.log(`CSS file: ${fileName} has been minified!`);
  }
  /**
   * Compress a JPG image.
   * @param {String} file - The path of the file to compress.
   * @param {String} fileName - The name of the file.
   */
  private compressJPG(file: string, fileName: string): void {
    console.log(`Compressing image: ${fileName}`);
    let ws: fs.WriteStream;
    fs.createReadStream(file)
        .pipe(mozjpeg(this.config.jpgOptions))
        .pipe(ws = fs.createWriteStream(`${file}.jpg`));
      ws.on("finish", () => {
        fs.unlinkSync(file);
        fs.renameSync(`${file}.jpg`, file);
        console.log(`Compressed JPG image: ${fileName}`);
      });
  }
  /**
   * Compress a PNG image.
   * @param {String} file - The path of the file to compress.
   * @param {String} fileName - The name of the file.
   */
  private compressPNG(file: string, fileName: string): void {
    execFile(optipng, [file, `${file}.png`, "-s0", "-k0", "-f0"], (err) => {
      if (err) {
        console.log(`Compressing ${fileName} resulted in an error and won't be compressed.`);
        if(this.config.showErrStack) {
          console.log(`An error has ocurred: ${err}`);
        }
      } else {
        fs.unlinkSync(file);
        fs.renameSync(`${file}.png`, file);
        console.log(`Compressed PNG image: ${fileName}`);
      }
    });
  }
}