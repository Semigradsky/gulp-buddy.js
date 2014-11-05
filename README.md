# [gulp](http://gulpjs.com)-buddy.js

> Gulp plugin for running buddy.js


## Install

```sh
$ npm install --save-dev gulp-buddy.js
```


## Usage

```js
var gulp = require('gulp');
var buddyjs = require('gulp-buddy.js');

gulp.task('default', function () {
  return gulp.src('app.js')
    .pipe(buddyjs({
      disableIgnore: true,
      reporter: detailed
    }));
});
```


### Options

#### ignore
Type: `Array`
Default value: `[0, 1]`

Numbers that will be ignored in the processing.

#### disableIgnore
Type: `Boolean`
Default value: `false`

Disables the ignore list.

#### enforceConst
Type: `Boolean`
Default value: `false`

Enforce literals to be declared with the `const` keyword.

#### noColor
Type: `Boolean`
Default value: `false`

Disables colors

#### reporter
Type: `String`
Default value: `simple`

Reporter to use. Options available are `simple`, `json` and `detailed`.