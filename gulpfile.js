const gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  runSequence = require('run-sequence'),
  rev = require('gulp-rev'),
  revAll = require('gulp-rev-all'),
  clean = require('gulp-clean'),
  fn = require('funclib'),
  less = require('gulp-less'),
  LessAutoprefix = require('less-plugin-autoprefix'),
  path = require('path');

const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

/**
 * 任务入口
 * ===================================================
 */
// npm start
gulp.task('dev', ['openSrc', 'less', 'watchSrc']);

// npm run check
gulp.task('check', ['openDist']);

// npm run build
gulp.task('build', done => runSequence(
  'clean', 'less', 'revSrc', 'copyLib', 'logInfo', 'openDist', done
));

/**
 * browser-sync相关任务
 * ===================================================
 */
gulp.task('openSrc', () => {
  browserSync.init({ server: './src', port: 8081 });
});
gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('watchSrc', () => {
  gulp.watch('./src/**', () => runSequence('less', 'reload'));
});

gulp.task('openDist', () => {
  browserSync.init({ server: './dist', port: 8082 });
});

gulp.task('less', () => {
  return gulp.src('./src/css/*.less')
    .pipe(less({ plugins: [autoprefix] }))
    .pipe(gulp.dest('./src/css'));
});

/**
 * rev相关任务
 * ===================================================
 */
gulp.task('clean', () => {
  return gulp.src('./dist').pipe(clean());
});

gulp.task('revSrc', () => {
  return gulp.src(['./src/**', '!./src/lib/**'])
    .pipe(revAll.revision({
      dontRenameFile: [/favicon.ico/g, /index.html/g, /abort.html/g, /contact.html/g, /shops.html/g],
      transformFilename: (file, hash) => {
        if (['index.html', 'favicon.ico'].some(fl => fn.contains(file.path, fl))) {
          return path.basename(file.path);
        }
        const ext = path.extname(file.path);
        return path.basename(file.path, ext) + '-' + hash.substr(0, 12) + ext;
      }
    }))
    .pipe(gulp.dest("./dist"))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev'));;
});

gulp.task('copyLib', () => {
  gulp.src(['./src/lib/**']).pipe(gulp.dest('./dist/lib'));
});

gulp.task('logInfo', () => {
  fn.defer(() => fn.log('构建成功！', 'Gulp'));
});