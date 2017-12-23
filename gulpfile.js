var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var del = require('del');
var eventStream = require('event-stream');
var less = require('gulp-less');
var path = require('path');
var templateCache = require('gulp-angular-templatecache');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var tsConfig = require('./tsconfig.json');
var ngAnnotate = require('gulp-ng-annotate');
var Server = require('karma').Server;

gulp.task('clean', function() {
  return del('dist/*');
});

gulp.task('tsc', ['clean'], function() {
  var tsResult = tsProject.src().pipe(tsProject());
  return eventStream.merge(
    tsResult.js.pipe(ngAnnotate()),
    tsResult.dts
  )
  .pipe(gulp.dest('dist/'));
});

gulp.task('templates', ['tsc'], function() {
  return eventStream.merge(
    gulp.src(['dist/hawtio-core.js']),
    gulp
      .src(['src/app/**/*.html', 'src/app/**/*.md'])
      .pipe(templateCache({
        module: 'hawtio-core'
      }))
  )
  .pipe(concat('hawtio-core.js'))
  .pipe(gulp.dest('dist/'));
});

gulp.task('copy-images', ['clean'], function() {
  return gulp.src('src/assets/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('less', ['clean'], function () {
  return gulp.src('src/app/**/*.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'src/app'),
        path.join(__dirname, 'node_modules')
      ]
    }))
    .pipe(concat('hawtio-core.css'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('connect', function() {
  connect.server({
    livereload: true,
    port: 2772,
    fallback: 'index.html'
  });
});

gulp.task('reload', function() {
  gulp.src('index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*'], ['build']);
  gulp.watch(['index.html', 'dist/**/*'], ['reload']);
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('build', ['tsc', 'templates', 'copy-images', 'less']);
gulp.task('default', ['build', 'connect', 'watch']);
