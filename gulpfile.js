var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    karma = require('karma').server,
    argv = require('yargs').argv,
    urljoin = require('urljoin'),
    gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins({});
var pkg = require('./package.json');
var bower = require('./bower.json');

var config = {
  ts: ['plugins/**/*.ts'],
  testTs: ['test-plugins/**/*.ts'],
  less: './plugins/**/*.less',
  templates: ['plugins/**/*.html'],
  testTemplates: ['test-plugins/**/*.html'],
  templateModule: pkg.name + '-templates',
  testTemplateModule: pkg.name + '-test-templates',
  dist: argv.out || './dist/',
  js: pkg.name + '.js',
  testJs: pkg.name + '-test.js',
  css: pkg.name + '.css',
  tsProject: plugins.typescript.createProject({
    target: 'ES5',
    module: 'commonjs',
    declarationFiles: true,
    noExternalResolve: false,
    removeComments: true
  }),
  testTsProject: plugins.typescript.createProject({
    target: 'ES5',
    module: 'commonjs',
    declarationFiles: false,
    noExternalResolve: false
  }),
};

gulp.task('bower', function() {
  return gulp.src('index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('.'));
    /*
  gulp.src('karma.conf.js')
    .pipe(wiredep({
      exclude: 'libs/webcomponentsjs/webcomponents.js'
    }))
    .pipe(gulp.dest('.'));
   */
});

gulp.task('watch', function() {
  //plugins.watch(['libs/**/*.d.ts', config.ts, config.templates], function() {
  //  gulp.start(['tsc', 'template', 'concat', 'clean']);
  //});
  //plugins.watch([config.testTs, config.testTemplates], function() {
  //  gulp.start([ 'example-template', 'example-concat', 'example-clean']);
  //});
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

/*
gulp.task('test', function() {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  });
});
*/

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(plugins.connect.reload());
});

gulp.task('default', ['connect']);
