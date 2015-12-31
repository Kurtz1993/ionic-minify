declare module "ionic-minify"{
  export class Minifier {
    /**
     * Creates a new ionicMinify compressor.
     * @param {HookConf} hookConf - Ionic Minify configuration object.
     * @param {String} 
     */
    constructor(hookConf: IMConfig, platforms: string[], basePath: string);
    /**
     * Runs the compressor to minify files.
     */
    public run(): void;
  }
}