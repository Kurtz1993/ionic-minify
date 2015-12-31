declare module "ionic-minify"{
  export class Minifier {
    /**
     * Creates a new ionicMinify compressor.
     * @param {HookConf} hookConf - Ionic Minify configuration object.
     * @param {String[]} platforms - An array of the platforms to compress.
     * @param {String} basePath - The platforms base path.
     */
    constructor(hookConf: IMConfig, platforms: string[], basePath: string);
    /**
     * Runs the compressor to minify files.
     */
    public run(): void;
  }
}