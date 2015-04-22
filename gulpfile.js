'use strict';
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var purescript = require('gulp-purescript');

var paths = {
  'psc': 'src/**/*.purs',
  'javascript': 'static/*js',
  'static': 'static/**/*',
  'pscLib': 'bower_components/*/src/**/*.purs'
};

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

gulp.task('purescript', function(){
  return gulp.src([paths.psc, paths.pscLib]).
    pipe(purescript.pscMake()
  );
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