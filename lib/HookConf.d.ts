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