var gulp = require('gulp');
var webpack = require('gulp-webpack');
var purescript = require('gulp-purescript');

var paths = {
  'psc': 'src/**/*.purs',
  'javascript': 'static/*js',
  'pscLib': 'bower_components/*/src/**/*.purs'
};

gulp.task('copy-css', function() {
   gulp.src(['static/main.css',
             'bower_components/bootstrap/dist/css/bootstrap.min.css'])
   .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-fonts', function() {
   gulp.src('bower_components/bootstrap/fonts/*.{woff,woff2}')
   .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copy-index-html', function() {
    gulp.src('static/index.html')
    .pipe(gulp.dest('./dist'));
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

gulp.task('default', ['purescript', 'copy-index-html', 'copy-css',
          'copy-fonts', 'copy-bullshit'], function() {
  return gulp.src('static/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});