var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    argv = require('yargs').argv,
    urljoin = require('urljoin'),
    gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins({});
var pkg = require('./package.json');
var bower = require('./bower.json');

var config = {
  dist: argv.out || './dist/'
};

gulp.task('bower', function() {
  return gulp.src('index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  plugins.watch(['libs/**/*.js', 'libs/**/*.css', 'index.html', urljoin(config.dist, '*')], function() {
    gulp.start('reload');
  });
});

gulp.task('connect', ['watch'], function() {
  plugins.connect.server({
    root: '.',
    livereload: true,
    port: 2772,
    fallback: 'index.html'
  });
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(plugins.connect.reload());
});

gulp.task('default', ['connect']);
