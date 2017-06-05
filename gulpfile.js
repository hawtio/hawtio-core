var gulp = require('gulp');
var connect = require('gulp-connect');
var src = ['dist/*.js', 'index.html'];

gulp.task('connect', function() {
  connect.server({
    livereload: true,
    port: 2772
  });
});

gulp.task('reload', function() {
  gulp.src(src)
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(src, ['reload']);
});

gulp.task('default', ['connect', 'watch']);
