var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');

gulp.task('watch', function() {
  watch(['libs/**/*.js', 'libs/**/*.css', 'index.html', 'dist/hawtio-core.js'], function() {
    gulp.start('reload');
  });
});

gulp.task('connect', ['watch'], function() {
  connect.server({
    root: '.',
    livereload: true,
    port: 2772,
    fallback: 'index.html'
  });
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(connect.reload());
});

gulp.task('default', ['connect']);
