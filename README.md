# ionic-minify
[![npm version](https://badge.fury.io/js/ionic-minify.svg)](http://badge.fury.io/js/ionic-minify)

### Supporting JPG image compression!

This Cordova hook minifies your JavaScript and CSS files, and compresses your JPG images, skipping ionic default libraries and other already-minifed (.min extension) files.

It DOES NOT compress the assets inside your www folder, it DOES on your respective platform's www folders, so your development files are never touched.

It is also compatible with Cordova/Phonegap!

## Install
Install this package inside of your app's root folder with this command.
```
  npm install ionic-minify --save-dev
```
The `--save-dev` flag is important! If you decide to work on another environment, ionic-minify cannot run without the original package and its dependencies! After install, an `after_prepare` folder will be added to your `hooks` folder with the `ionic-minify.js` script in it.

## Usage
Once you installed it, the hook will minify your app's JS and CSS, and compress JPG files whenever you run `ionic prepare <platform>` or `ionic build <platform>` with the `--release` flag.

## Configuration
ionic-minify now supports configuration file!

You can find this file inside your hooks/ folder with the name of minify-conf.json

```javascript
{
  "foldersToProcess": [ // Folders that are going to be processed.
    "js",
    "css",
    "lib"
  ],
  "jpgOptions":{  // mozjpeg options
    "quality": 50
  },
  "jsOptions": { // UglifyJS2 options, see https://github.com/mishoo/UglifyJS2#api-reference for more options.
    "compress": {
      "drop_console": true
    },
    "fromString": true
  },
  "cssOptions": { // Clean CSS options, see https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-programmatically for more options.
    "noAdvanced": true,
    "keepSpecialComments": 0
  }
}
```

## Quirks:
* On Linux and OSX: `hooks` folder needs to have permissions modified.  Perform a `chmod -R 755 /hooks` to resolve this issue.

## License
#### MIT
The MIT License (MIT)


Copyright (c) 2015 Luis Rogelio Hernández López


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:


The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


Ionic-minify is derived from the work of [Ross Martin's original cordova-uglify](https://github.com/rossmartin/cordova-uglify).
