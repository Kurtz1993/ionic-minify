# cordova-minify

Cordova hook that uglifies and minifies your app's Javascript files, minifies CSS files, and compresses your image files. It is derived from the work of Ross Martin's original [cordova-uglify](https://github.com/rossmartin/cordova-uglify), with the added image compression and recursive search for your script and stylesheets inside your js/ and css/ folders in www. This DOES NOT compress the assets in your www folder, but rather, on your respective platform's www folders, so your development environment isn't touched, and your apps stay fast and slim!

## Install
Install the following package below inside of your apps root folder.
```
npm install cordova-minify
```
After install an `after_prepare` folder will be added to your `hooks` folder with the `minify.js` script in it.

## Usage
Once you have this hook installed it will compress your app's JavaScript and CSS when you run a `cordova prepare <platform>` or `cordova build <platform>` command.  This hook does not change your assets that live in the root www folder; it will uglify the assets that get outputted to the platforms folder after a `prepare` or `build`.

By default the hook will uglify the JavaScript, CSS, and images in the `<platform>` `www/js`, `www/css`, and `www/img` of your project [Take a look at this line in the hook to add more folders to be minified - optional](https://github.com/alastairparagas/cordova-minify/blob/master/after_prepare/minify.js#l35). You can configure the hook to uglify/minify only for a release build, [see here](https://github.com/alastairparagas/cordova-minify/blob/master/after_prepare/minify.js#l17).

## Requirements
Out of the box this hook requires Cordova 3.3.1-0.4.2 and above but it can work with versions 3.0.0 thru 3.3.0 if you manually indicate the path for the platforms directories on Android and iOS[see here](https://github.com/alastairparagas/cordova-minify/blob/master/after_prepare/minify.js#l17).  This is becuase the `CORDOVA_PLATFORMS` environment variable was not added until version 3.3.1-0.4.2 ([see this post by Dan Moore](http://www.mooreds.com/wordpress/archives/1425)).

## Quirks:
* On Linux: `hooks` folder needs to have permissions modified.  Perform a `chmod -R 755 /hooks` to resolve this issue.

## License
[MIT](https://github.com/alastairparagas/cordova-minify/blob/master/LICENSE)