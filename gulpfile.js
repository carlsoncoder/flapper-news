// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');
var install = require('gulp-install');

// Installation task
gulp.task('install', function() {
   gulp.src(
       [
           './package.json',
           './bower.json'
       ])
       .pipe(install());
});

// JS Hint task
gulp.task('jshint', function() {
    gulp.src(
        [
            '*.js',
            'config/*.js',
            'routes/*.js',
            'models/*.js',
            'public/javascripts/*.js'
        ],
        { base: '/' })
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('develop', function() {
   nodemon(
       {
           script: 'app.js',
           ext: 'html js css json',
           ignore: ['gulpfile.js'],
           tasks: ['jshint']
       })
       .on('restart', function() {
           console.log('Node Restarted!');
       });

});

gulp.task('default', ['install', 'jshint', 'develop'], function() {
    console.log('Gulp Running!');
});