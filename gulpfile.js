var gulp = require('gulp');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var del = require('del');
var eventStream = require('event-stream');
var less = require('gulp-less');
var path = require('path');
var templateCache = require('gulp-angular-templatecache');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var ngAnnotate = require('gulp-ng-annotate');
var Server = require('karma').Server;
var hawtio = require('@hawtio/node-backend');
var packageJson = require('./package.json');
var replace = require('gulp-replace');

var config = {
  dist: argv.out || './dist/',
};

gulp.task('clean', function() {
  return del('dist/*');
});

gulp.task('tsc', ['clean'], function() {
  var tsResult = tsProject.src().pipe(tsProject());
  return eventStream.merge(
    tsResult.js.pipe(ngAnnotate()),
    tsResult.dts
  )
  .pipe(gulp.dest(config.dist));
});

gulp.task('templates', ['tsc'], function() {
  return eventStream.merge(
    gulp.src([config.dist + 'hawtio-core.js']),
    gulp
      .src(['src/app/**/*.html', 'src/app/**/*.md'])
      .pipe(templateCache({
        module: 'hawtio-core'
      }))
  )
  .pipe(concat('hawtio-core.js'))
  .pipe(gulp.dest(config.dist));
});

gulp.task('copy-images', ['clean'], function() {
  return gulp.src('src/assets/img/**/*')
    .pipe(gulp.dest(config.dist + 'img'));
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
    .pipe(gulp.dest(config.dist));
});

gulp.task('connect', function() {
  hawtio.setConfig({
    port: 2772,
    staticAssets: [{
      path: '/hawtio/',
      dir: '.'
    }],
    fallback: 'index.html',
    liveReload: {
      enabled: true
    }
  });
  hawtio.use('/', function(req, res, next) {
          var path = req.originalUrl;
          if (path === '/') {
            res.redirect('/hawtio/');
          } else {
            next();
          }
        });
  hawtio.listen(function(server) {
    var host = server.address().address;
    var port = server.address().port;
    console.log("started from gulp file at ", host, ":", port);
  });
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(hawtio.reload());
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*'], ['build']);
  gulp.watch(['index.html', config.dist + '**/*'], ['reload']);
});

gulp.task('test', ['build'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('version', function() {
  gulp.src(config.dist + 'hawtio-core.js')
    .pipe(replace('PACKAGE_VERSION_PLACEHOLDER', packageJson.version))
    .pipe(gulp.dest(config.dist));
});

gulp.task('build', ['tsc', 'templates', 'copy-images', 'less']);
gulp.task('default', ['build', 'connect', 'watch']);
