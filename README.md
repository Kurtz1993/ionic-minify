# ionic-minify

This Cordova hook minifies your JavaScript files, minifies CSS files and compresses PNG, SVG, JPG, JPEG and GIF images. It DOES NOT compress the assets inside your www folder, it DOES on your respective platform's www folders, so your development files are never touched.

## Install
Install this package inside of your app's root folder with this command.
```
npm install ionic-minify --save-dev
```
The `--save-dev` flag is important! If you decide to work on another environment, ionic-minify cannot run without the original package and its dependencies! After install, an `after_prepare` folder will be added to your `hooks` folder with the `ionic-minify.js` script in it.

## Usage
Once you installed it, the hook will compress your app's JS, CSS, PNG, SVG, JPG, JPEG and GIF files whenever you run `ionic prepare <platform>` or `ionic build <platform>` with the `--release` flag.
These are the folders that are compressed by default: `www/js`, `www/css`, `www/img`, and `www/lib`, but you can modify the hook file to compress other folders. [Take a look at this line in the hook to add more folders to be minified - optional](https://github.com/Kurtz1993/ionic-minify/blob/master/after_prepare/ionic-minify.js#l116).
If you want to always compress your files [you can check this line](https://github.com/Kurtz1993/ionic-minify/blob/master/after_prepare/ionic-minify.js#l4).

## Notes
Out of the box this hook requires Cordova 3.3.1-0.4.2 and above but it can work with versions 3.0.0 thru 3.3.0 if you manually indicate the path for the platforms directories on Android and iOS [see here](https://github.com/Kurtz1993/ionic-minify/blob/master/after_prepare/ionic-minify.js#l23).

## Quirks:
* On Linux and OSX: `hooks` folder needs to have permissions modified.  Perform a `chmod -R 755 /hooks` to resolve this issue.

## License
[MIT](https://github.com/Kurtz1993/ionic-minify/blob/master/LICENSE)
Ionic-minify is derived from the work of [Ross Martin's original cordova-uglify](https://github.com/rossmartin/cordova-uglify).