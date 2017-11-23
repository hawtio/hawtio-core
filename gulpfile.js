var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var del = require('del');
var eventStream = require('event-stream');
var templateCache = require('gulp-angular-templatecache');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var tsConfig = require('./tsconfig.json');
var ngAnnotate = require('gulp-ng-annotate');
var Server = require('karma').Server;

gulp.task('clean', function() {
  return del('dist/*.js');
});

gulp.task('tsc', ['clean'], function() {
  var tsResult = tsProject
    .src()
    .pipe(tsProject());
  
  // DEFINITION FILE IS NOT GENERATED
  // tsResult
  //   .dts
  //   .pipe(gulp.dest('dist/'));

  return eventStream.merge(
    tsResult
      .js
      .pipe(ngAnnotate()),
    gulp
      .src(['templates/**/*.html'])
      .pipe(templateCache({
        root: 'templates/',
        module: 'hawtio-nav'
      }))
    )
    .pipe(concat('hawtio-core.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('connect', function() {
  connect.server({
    livereload: true,
    port: 2772
  });
});

gulp.task('reload', function() {
  gulp.src('index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch([tsConfig.include], ['build']);
  gulp.watch(['index.html', 'dist/**/*'], ['reload']);
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('build', ['tsc']);
gulp.task('default', ['build', 'connect', 'watch']);
