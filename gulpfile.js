var gulp = require('gulp');
var connect = require('gulp-connect');
var del = require('del');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var tsConfig = require('./tsconfig.json');

gulp.task('clean', function() {
  return del('dist/hawtio-core.js');
});

gulp.task('tsc', ['clean'], function() {
  tsProject.src()
    .pipe(tsProject())
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

gulp.task('build', ['tsc']);
gulp.task('default', ['build', 'connect', 'watch']);
