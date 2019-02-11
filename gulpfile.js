const gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  runSequence = require('run-sequence'),
  rev = require('gulp-rev'),
  revAll = require('gulp-rev-all'),
  clean = require('gulp-clean'),
  fn = require('funclib'),
  less = require('gulp-less'),
  imagemin = require('gulp-imagemin'),
  LessAutoprefix = require('less-plugin-autoprefix'),
  path = require('path'),
  glob = require('glob');

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
  'clean', 'less', 'revSrc', 'revJsImg', 'copyLib', 'logInfo', 'openDist', done
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

gulp.task('imgMin', function () {
  gulp.src('./src/img/**')
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest('./src/img'));
});

gulp.task('revSrc', () => {
  const excludeFiles = [/favicon.ico/mg, /index.html/mg, /about.html/mg, /contact.html/mg, /shops.html/mg];
  return gulp.src(['./src/**', '!./src/lib/**', '!./src/**/*.less'])
    .pipe(revAll.revision({
      dontRenameFile: excludeFiles,
      transformFilename: (file, hash) => {
        if (excludeFiles.some(fl => fn.contains(file.path, fl.source))) {
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

gulp.task('revJsImg', () => {
  const files = glob.sync('./dist/img/**').map(url => url.replace('./dist', '.'));
  const mainJsPath = fn.find(glob.sync('./dist/js/*.js'), pt => pt.includes('main'));
  let mainJs = fn.rd(mainJsPath);
  const imgs = [
    './img/about/bg_01.jpg',
    './img/about/txt_01_01.png',
    './img/about/pic_01_01.png',
    './img/shops/bg_01.jpg',
    './img/shops/txt_01_01.png',
    './img/contact/bg_01.jpg',
    './img/contact/txt_01_01.png',
    './img/home/bg_01.jpg',
    './img/home/txt_01_01.png',
    './img/home/pic_01.png',
  ]
  const imgBase = imgs.map(img => img.replace(/(.jpg)|(.png)/mig, ''));
  files.forEach(f => {
    imgBase.forEach((base, i) => {
      if (f.includes(base)) {
        mainJs = mainJs.replace(imgs[i], f);
      }
    });
  });
  fn.wt(mainJsPath, mainJs);
});

gulp.task('copyLib', () => {
  gulp.src(['./src/lib/**']).pipe(gulp.dest('./dist/lib'));
});

gulp.task('logInfo', () => {
  fn.defer(() => fn.log('构建成功！', 'Gulp'));
});