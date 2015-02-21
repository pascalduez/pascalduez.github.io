'use strict';

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var svgmin = require('gulp-svgmin');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var gutil = require('gulp-util');
var lazypipe = require('lazypipe');
var gulpif = require('gulp-if');
var compression = require('compression');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

//var devMode = gutil.env.type === 'develop';
var devMode = true;


gulp.task('styles', function () {
  var processors = [
    require('autoprefixer-core')()
  ];

  var devPipeline = lazypipe()
    .pipe(gulp.dest, 'assets/css')
    .pipe(filter, '**/*.css')
    .pipe(reload, { stream: true });

  var distPipeline = lazypipe()
    .pipe(gulp.dest, 'assets/css');

  return gulp.src('scss/**/*.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(postcss(processors))
    .pipe(gulpif(devMode, devPipeline(), distPipeline()));
});


gulp.task('scripts', function () {
  var devPipeline = lazypipe()
    .pipe(gulp.dest, 'assets/js')
    .pipe(filter, '**/*.js')
    .pipe(reload, { stream: true });

  var distPipeline = lazypipe()
    .pipe(filter, '**/*.js')
    .pipe(uglify)
    .pipe(rename, { extname: '.min.js' })
    .pipe(gulp.dest, 'assets/js');

  return gulp.src('assets/js/*.js')
    .pipe(gulpif(devMode, devPipeline(), distPipeline()));
});


gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: './',
      middleware: compression()
    },
    // open: false,
    browser: 'FirefoxNightly',
  });
});

// Reload all Browsers
gulp.task('bs-reload', function () {
  browserSync.reload();
});


gulp.task('svgmin', function () {
  return gulp.src('assets/svg/*.svg')
    .pipe(svgmin({
      plugins: [{ removeViewBox: false }]
    }))
    .pipe(gulp.dest('assets/svg'));
});


gulp.task('jpgmin', function () {
  var mozjpeg = require('imagemin-mozjpeg');

  return gulp.src('assets/img/*.jpg')
    .pipe(mozjpeg({ quality: '80-90' })())
    .pipe(gulp.dest('assets/img'));
});


// Development task.
gulp.task('develop', ['browser-sync'], function () {
  gulp.watch('scss/**/*.scss', ['styles']);
  gulp.watch('assets/js/*.js', ['scripts']);
  gulp.watch('*.html', ['bs-reload']);
});


// Pre-publish tasks.
gulp.task('dist', ['styles', 'scripts', 'svgmin']);


// Push gh-pages preview.
// gulp.task('deploy', function () {
//   var deploy = require('gulp-gh-pages');
//
//   return gulp.src('./**/*')
//     .pipe(deploy());
// });
