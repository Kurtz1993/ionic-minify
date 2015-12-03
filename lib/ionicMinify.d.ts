declare interface IHookConfig{
  /**
   * An array that contains the names of the folders to compress.
   */
  foldersToProcess: string[],
  /**
   * Specify the output quality of the jpg compressed image.
   */
  jpgOptions: {quality: number},
  /**
   * Specify the options of UglifyJS.
   */
  jsOptions: any,
  /**
   * Specify the options of CleanCSS.
   */
  cssOptions: any,
  /**
   * If true, the hook will always run.
   */
  alwaysRun: boolean,
  /**
   * If true, will show the error stack if errors occur.
   */
  showErrStack: boolean
}

declare module "ionic-minify"{
  export class Minifier {
    /**
     * Creates a new ionicMinify compressor.
     * @param {HookConf} hookConf Ionic Minify configuration object.
     * @param {String} 
     */
    constructor(hookConf: IHookConfig, platforms: string[], basePath: string);
    /**
     * Runs the compressor to minify files.
     */
    public run();
    
    /**
     * Set the paths for all the platforms that are going to be minified.
     */
    private setPlatformPaths();
    
    /**
     * Process all the files in a directory-
     * @param {string} dir The directory that contains the files to be processed.
     */
    private processFiles(dir: string);
    
    /**
     * Compress the specified file.
     * @param {string} file The file path.
     */
    private compress(file: string);
  }
}