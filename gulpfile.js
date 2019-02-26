var gulp = require('gulp');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var del = require('del');
var less = require('gulp-less');
var path = require('path');
var templateCache = require('gulp-angular-templatecache');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var tsProjectExample = ts.createProject('tsconfig-example.json');
var ngAnnotate = require('gulp-ng-annotate');
var Server = require('karma').Server;
var hawtio = require('@hawtio/node-backend');
var packageJson = require('./package.json');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var merge2 = require('merge2');
var sass = require('gulp-sass');

var config = {
  dist: argv.out || './dist/',
  distExample: 'dist-example/',
  srcImg: 'src/img/*',
  distImg: 'dist/img',
  tempImg: 'img/'
};

gulp.task('clean', function () {
  if (!argv.out) {
    return del([config.dist, 'img']);
  }
});

gulp.task('tsc', ['clean'], function () {
  var templates = gulp.src(['src/app/**/*.html', 'src/app/**/*.md']).pipe(templateCache({ module: 'hawtio-core' }));
  var tsResult = tsProject.src().pipe(tsProject());
  var js = merge2(tsResult.js.pipe(ngAnnotate()), templates)
    .pipe(concat('hawtio-core.js'))
  return merge2(js, tsResult.dts)
    .pipe(gulp.dest(config.dist));
});

gulp.task('copy-images', ['clean'], function () {
  return gulp.src(config.srcImg)
  .pipe(gulp.dest(config.distImg))
  .pipe(gulp.dest(config.tempImg));
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

gulp.task('sass', ['clean'], function () {
  gulp
    .src('src/patternfly.scss')
    .pipe(sass())
    .pipe(replace('./assets/images/', '../img/'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('clean-example', function () {
  return del(config.distExample);
});

gulp.task('hawtio-core-types', ['tsc'], function () {
  gulp.src("./dist/hawtio-core.d.ts")
    .pipe(rename("index.d.ts"))
    .pipe(gulp.dest("./dist-example/types/hawtio-core"));
});

gulp.task('tsc-example', ['clean-example', 'hawtio-core-types'], function () {
  tsProjectExample.src()
    .pipe(tsProjectExample())
    .js
    .pipe(ngAnnotate())
    .pipe(gulp.dest(config.distExample));
});

gulp.task('connect', ['build-example'], function () {
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
  hawtio.use('/', function (req, res, next) {
    var path = req.originalUrl;
    if (path === '/') {
      res.redirect('/hawtio/');
    } else {
      next();
    }
  });
  hawtio.listen(function (server) {
    var host = server.address().address;
    var port = server.address().port;
    console.log("started from gulp file at ", host, ":", port);
  });
});

gulp.task('reload', function () {
  gulp.src('.')
    .pipe(hawtio.reload());
});

gulp.task('watch', ['build-example'], function () {
  gulp.watch(['src/**/*'], ['build-example']);
  gulp.watch(['index.html', config.distExample + '**/*'], ['reload']);
});

gulp.task('test', ['build'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, function() {
    done();
  }).start();
});

gulp.task('version', function () {
  gulp.src(config.dist + 'hawtio-core.js')
    .pipe(replace('PACKAGE_VERSION_PLACEHOLDER', packageJson.version))
    .pipe(gulp.dest(config.dist));
});

gulp.task('build', ['tsc', 'copy-images', 'less', 'sass']);
gulp.task('build-example', ['build', 'tsc-example']);
gulp.task('default', ['connect', 'watch']);
