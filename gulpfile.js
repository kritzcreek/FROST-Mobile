'use strict';
var gulp = require('gulp');
var webpack = require('webpack-stream');
var purescript = require('gulp-purescript');

var paths = {
  'psc': ['src/**/*.purs', 'src/**/*.js'],
  'javascript': 'static/*js',
  'static': 'static/**/*'
};

var sources = [
  'src/**/*.purs',
  'bower_components/purescript-*/src/**/*.purs'
];

var foreigns = [
  'src/**/*.js',
  'bower_components/purescript-*/src/**/*.js'
];

gulp.task('copy-index-html', function() {
    gulp.src('static/index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-css', function() {
    gulp.src('static/main.css')
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-bullshit', function() {
   gulp.src(['bower_components/jquery/dist/jquery.js',
             'bower_components/rxjs/dist/rx.lite.js',
             'bower_components/rxjs-jquery/rx.jquery.js'])
   .pipe(gulp.dest('./dist/js/lib'));
});

gulp.task('purescript', function () {
  return purescript.psc({ src: sources, ffi: foreigns });
});


gulp.task('watch', function() {
  gulp.watch(paths.psc, ['default']);
  gulp.watch(paths.static, ['default']);
});

gulp.task('default', ['purescript', 'copy-index-html',
                      'copy-bullshit', 'copy-css', 'watch'], function() {
  return gulp.src('static/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});
