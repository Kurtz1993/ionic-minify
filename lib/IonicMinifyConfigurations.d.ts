declare interface IMConfig{
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
  jsOptions: UJSConfig,
  /**
   * Specify the options of CleanCSS.
   */
  cssOptions: CleanCSSConfig,
  /**
   * If true, the hook will always run.
   */
  alwaysRun: boolean,
  /**
   * If true, will show the error stack if errors occur.
   */
  showErrStack: boolean
}

declare interface UJSCompressorOptions {
  /**
   * Join consecutive simple statements using the comma operator.
   */
  sequences?: boolean,
  /**
   * Rewrite property access using the dot notation.
   */
  properties?: boolean,
  /**
   * Remove unreachable code.
   */
  dead_code?: boolean,
  /**
   * Remove debugger; statements.
   */
  drop_debugger?: boolean,
  /**
   * Apply optimizations for if's and conditional expressions.
   */
  conditionals?: boolean,
  /**
   * Attempt to evaluate constant expressions.
   */
  evaluate?: boolean,
  /**
   * Various optimizations for boolean context.
   */
  booleans?: boolean,
  /**
   * Optimizations for do, while and for loops when we can statically determine the condition.
   */
  loops?: boolean,
  /**
   * Drop unreferenced functions and variables.
   */
  unused?: boolean,
  /**
   * Hoist function declarations.
   */
  hoist_funs?: boolean,
  /**
   * Optimizations for if/return and if/continue.
   */
  if_return?: boolean,
  /**
   * Join consecutive var statements.
   */
  join_vars?: boolean,
  /**
   * Small optimization for sequences.
   */
  cascade?: boolean,
  /**
   * Negate Immediately-Invoked Function Expressions where the return value is
   * discarded, to avoid the parens that the code generator would insert. 
   */
  negate_iife?: boolean,
  /**
   * Discard calls to console.* functions.
   */
  drop_console?: boolean
}

declare interface UJSConfig {
  /**
   * Display compressor warnings.
   * @default false
   */
  warnings?: string,
  /**
   * UglifyJS custom compressor options.
   * @default {}
   */
  compress?: UJSCompressorOptions
}