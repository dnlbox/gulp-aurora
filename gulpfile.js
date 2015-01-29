"use strict";

// Include gulp
var gulp = require('gulp');

// Include Plugins
var connect = require('gulp-connect');   // Connect is great to up a server and livereload - realy fast
var jade    = require('gulp-jade');      // Jade for html best syntax and not to worry about end tags
var sass    = require('gulp-sass');      // We need a preprocessing for css and SaSS is great - but we gonna use scss syntax
var del     = require('del');            // Clean folders before build
var plumber = require('gulp-plumber');   // Handle errors
var gutil   = require('gulp-util');      // To beep on error and custom logs
var changed = require('gulp-changed');   // Only rebuild changed files
var debug   = require('gulp-debug');     // It's good to see what files changed

var paths = {
  templates: ['src/templates/**/*.jade'],
  sass: ['src/sass/**/*.scss'],
  js: ['src/js/**/*.js']
};

var onError = function (err) {
  gutil.beep();
  gutil.log(gutil.colors.yellow(err.message));
};

// --------------- DEVELOPMENT --------------- //
// Use 'gulp' command to up server and livereload

gulp.task('jade:development', function () {
  return gulp.src(paths.templates)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('builds/development', { extension: '.html' }))
    .pipe(debug())
    .pipe(jade())
    .pipe(gulp.dest('builds/development'))
    .pipe(connect.reload());
});

gulp.task('sass:development', function () {
  return gulp.src(paths.sass)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('builds/development/css', { extension: '.css' }))
    .pipe(debug())
    .pipe(sass())
    .pipe(gulp.dest('builds/development/css'))
    .pipe(connect.reload());
});

gulp.task('js:development', function () {
  return gulp.src(paths.js)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('builds/development/js', { extension: '.js' }))
    .pipe(debug())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(paths.templates, ['jade:development']);
  gulp.watch(paths.sass, ['sass:development']);
  gulp.watch(paths.js, ['js:development']);
});

gulp.task('connect', function () {
  connect.server({
    port: 3000,
    root: ['builds/development'],
    livereload: true
  });
});

gulp.task('default', ['jade:development', 'sass:development', 'js:development', 'watch', 'connect']);

// --------------- PRODUCTION --------------- //
// Use 'gulp prod' command to generate production package.
// Note: Could be possible use 'gutil.env.prod' but 'gulp prod'
//       seems to be more natural then 'gulp --prod'.

gulp.task('clean:jade', function (cb) {
  del([
    'builds/production/templates/**',
  ], cb);
});

gulp.task('jade:production', function () {
  return gulp.src(paths.templates)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(jade())
    .pipe(gulp.dest('builds/production'));
});

gulp.task('clean:sass', function (cb) {
  del([
    'builds/production/css/**',
  ], cb);
});

gulp.task('sass:production', function () {
  return gulp.src(paths.sass)
    .pipe(sass())
    .pipe(gulp.dest('builds/production/css'));
});

gulp.task('prod', ['clean:jade', 'jade:production', 'clean:sass', 'sass:production']);