# cordova-minify

Cordova hook that uglifies and minifies your app's Javascript files, minifies CSS files, and compresses your image files. It is derived from the work of [Ross Martin's original cordova-uglify](https://github.com/rossmartin/cordova-uglify), with the added image compression and recursive search for your script and stylesheets inside your js/ and css/ folders in www. This DOES NOT compress the assets in your www folder, but rather, on your respective platform's www folders, so your development environment isn't touched, and your apps stay fast and slim!

## Install
Install this package inside of your app's root folder with this command.
```
npm install cordova-minify --save-dev
```
The `--save-dev` flag is important! If you decide to work on another environment, cordova-minify cannot run without the original package and its dependencies! After install, an `after_prepare` folder will be added to your `hooks` folder with the `cordova-minify.js` script in it.

## Some valid Cordova development questions...

### Why not just use Grunt/Yeoman?
One can use Grunt/Yeoman, though I feel that those are more suited for building web applications/assets, whereas this NPM package is solely developed for Cordova and does not touch your development environment - being the www folder, but rather, only the produced assets. Also, I feel like pulling out Yeoman is an overkill for Cordova, which tends to be a repetitive build process from the start, whereas just pure Grunt configuration takes forever. With cordova-minify, install the plugin, and done!

### Why minify/compress your CSS/Javascript/Images?
Though you are not improving network speeds considering that assets are not being transmitted over the internet (packaged in your app - duh), I feel that it will help to compress javascript, css, and images to reduce app size and promote performance improvements. App size is a problem for lower-end phones that have limited storage - I personally found this a problem with my Pantech Burst (Android 4.0 - Ice Cream Sandwich).

## Usage
Once you have this hook installed it will compress your app's JavaScript and CSS when you run a `cordova prepare <platform>` or `cordova build <platform>` command.  This hook does not change your assets that live in the root www folder; it will uglify the assets that get outputted to the platforms folder after a `prepare` or `build`.

By default the hook will uglify the JavaScript, CSS, and images in the `<platform>` `www/js`, `www/css`, and `www/img` of your project [Take a look at this line in the hook to add more folders to be minified - optional](https://github.com/alastairparagas/cordova-minify/blob/master/after_prepare/cordova-minify.js#l111). You can configure the hook to uglify/minify only for a release build, [see here](https://github.com/alastairparagas/cordova-minify/blob/master/after_prepare/cordova-minify.js#l17).

## Requirements
Out of the box this hook requires Cordova 3.3.1-0.4.2 and above but it can work with versions 3.0.0 thru 3.3.0 if you manually indicate the path for the platforms directories on Android and iOS [see here](https://github.com/alastairparagas/cordova-minify/blob/master/after_prepare/cordova-minify.js#l15).  This is because the `CORDOVA_PLATFORMS` environment variable was not added until version 3.3.1-0.4.2 ([see this post by Dan Moore](http://www.mooreds.com/wordpress/archives/1425)).

## Future Development
* External Config file
    * Configuration of how image, css, and javascript files are compressed - abstraction away from underlying code, preventing more mess-ups.
        * https://github.com/kevva/imagemin for image compression
        * https://github.com/mishoo/UglifyJS2 for js compression/"uglification"
        * https://github.com/GoalSmashers/clean-css for css cleaning/compression
    * Folders to include for the whole image/css/javascript compression process
* HTML compression
* JSDoc HTML generation for sharing API information amongst developers
* Additional support for other platforms currently not supported - anything other than Android and iOS
        
        
* Configuration of how image, css, and javascript files are compressed in a configuration file for easier and cleaner implementation, preventing the developer from messing up with underlying code.

## Quirks:
* On Linux and OSX: `hooks` folder needs to have permissions modified.  Perform a `chmod -R 755 /hooks` to resolve this issue.

## License
[MIT](https://github.com/alastairparagas/cordova-minify/blob/master/LICENSE)
