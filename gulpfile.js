'use strict';

var gulp       = require('gulp'),
    del        = require('del'),
    sass       = require('gulp-sass'),
    maps       = require('gulp-sourcemaps'),
    swig       = require('gulp-swig'),
    concat     = require('gulp-concat'),
    plumber    = require('gulp-plumber'),
    watch      = require('gulp-watch'),
    sequence = require('gulp-watch-sequence'),
    webserver  = require('gulp-webserver');

var opt = {
  'src': './src',
  'view': './src',
  'sass': './src/scss',
  'font': './src/fonts',
  'dist': './public',
  'public': './public'
};

var scripts = [
  './app.js'
];



gulp.task('concatScripts', function () {
  return gulp.src(scripts)
  .pipe(maps.init({loadMaps: true}))
  .pipe(concat('app.js'))
  .pipe(maps.write())
  .pipe(gulp.dest(opt.public + '/js'));
});


gulp.task('view', function (){
  return gulp.src(opt.view + '/*.html')
  .pipe(plumber())
  .pipe(swig())
  .pipe(gulp.dest(opt.public));
});



gulp.task('sass', function (){
  return gulp.src(opt.sass + '/style.scss')
  .pipe(plumber())
  .pipe(maps.init({loadMaps: true}))
  .pipe(sass({
    outputStyle: 'nested',
    debug : true
  }).on('error', sass.logError))
  .pipe(maps.write('./'))
  .pipe(gulp.dest(opt.public + '/css'));
});


gulp.task('watch', function () {
  var queue = sequence(300);
  watch([opt.sass + '/**/*.scss'], {
    name      : 'CSS',
    emitOnGlob: false
  }, queue.getHandler('sass'));

  watch(opt.view + '/*.html', {
    name      : 'HTML',
    emitOnGlob: false
  }, queue.getHandler('view'));
});

gulp.task('webserver', function() {
  gulp.src(opt.dist)
    .pipe(webserver({
      livereload: true,
      open: false,
      port: 3000
    }));
});


gulp.task('clean', function (){
  del(opt.public);
});

gulp.task('build',['sass', 'view'], function (){

});



gulp.task('default', function (){
  gulp.start('webserver','build', 'watch');
});
