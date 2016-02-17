# ionic-minify
[![npm version](https://badge.fury.io/js/ionic-minify.svg)](http://badge.fury.io/js/ionic-minify)

#### Ionic-minify is a derived work of [Ross Martin's original cordova-uglify](https://github.com/rossmartin/cordova-uglify).

# Important note

The use of the `--release` flag is deprecated, use `--minify` instead.

## Changelog
[Here](https://github.com/Kurtz1993/ionic-minify/releases) you can find the changelog.

ionic-minify is a Cordova hook that minifes Javascript and CSS files, and it compress JPG and PNG images from your Cordova/Phonegap, Ionic or other Hybrid Cordova-based project. 

## Install
Just run the following command inside your project's root folder:
```
  npm install ionic-minify --save-dev
```
## Usage
Just run `ionic prepare <platform>` or `ionic build <platform>` with the `--minify` flag or set the `alwaysRun` attribute inside the configuration file to true.

## Configuration
You can find this file inside your hooks/ folder with the name minify-conf.json


```javascript
{
  // Folders that are going to be processed.
  "foldersToProcess": [
    "js",
    "css",
    "img"
  ],
  "jpgOptions":{
    "quality": 50
  },
  "jsOptions": {
    "compress": {
      "drop_console": true
    }
  },
  "cssOptions": {
    "keepSpecialComments": 0
  },
  "alwaysRun": false, // Set to true if you want the hook to always run.
  "showErrStack": false // Set to true to show the error stack when a file fails to minify/compress.
}
```
You can find valid UglifyJS options for Ionic Minify [here.](https://github.com/Kurtz1993/ionic-minify/blob/master/lib/IonicMinifyConfigurations.d.ts#L92)

You can find valid CleanCSS options for Ionic Minify [here.](https://github.com/Kurtz1993/ionic-minify/blob/master/lib/IonicMinifyConfigurations.d.ts#L105)

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