var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    karma = require('karma').server,
    gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins({ lazy: false });

var config = {
  jsFile: 'app.js',
  defsFile: 'hawtio.d.ts',
  jsDir: 'js',
  definitionsDir: 'definitions',
  app: '.',
  dist: 'dist',
  src: ['*.html', '**/*.js' ]
};

var tsProject = plugins.typescript.createProject({
  target: 'ES5',
  module: 'commonjs',
  sortOutput: true,
  declarationFiles: true,
  noExternalResolve: true
});

gulp.task('bower', function() {
  gulp.src('index.html')
    .pipe(wiredep({
      exclude: 'libs/polymer/polymer.js'
    }))
    .pipe(gulp.dest('.'));
  gulp.src('karma.conf.js')
    .pipe(wiredep({}))
    .pipe(gulp.dest('.'));
});

gulp.task('connect', function() {
  plugins.watch(config.src, function() {
    gulp.start('reload');
  });
  plugins.connect.server({
    root: config.app,
    livereload: true,
    port: 2772,
    fallback: 'index.html'
  });
});

gulp.task('test', function() {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  });
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(plugins.connect.reload());
});

gulp.task('default', ['test', 'connect']);
