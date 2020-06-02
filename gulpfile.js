const gulp = require('gulp');
// const path = require('path');
const chalk = require('chalk');
// const sass = require('gulp-sass');
const ts = require('gulp-typescript');
// const react = require('gulp-react');
const babel = require('gulp-babel');
// const replace = require('gulp-replace');
// const base64 = require('gulp-base64');
const { urlLoader } = require('gulp-url-loader');
// const rename = require('gulp-rename');
const clean = require('gulp-clean');
const merge = require('merge2');
// const cwd = process.cwd();

// function getProjectPath(...filePath) {
//   return path.join(cwd, ...filePath);
// }
const tsProject = ts.createProject('tsconfig.json', { declaration: true });
// const tsFiles = ['**/*.ts', '**/*.tsx', '!node_modules/**/*.*', 'typings/**/*.d.ts'];

// 删除上次build的文件
gulp.task('clean', function() {
  return gulp.src('lib', { read: false, allowEmpty: true }).pipe(clean({ force: true }));
});

// 编译components中组件tsx
gulp.task('tsx', function() {
  const tsResult = gulp
    .src(['src/**/*.tsx', 'src/**/*.ts'])
    .pipe(urlLoader())
    .pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest('lib')),
    tsResult.js.pipe(
      babel()
    ).pipe(gulp.dest('lib'))
  ]);
});

// 编译components中组件js
gulp.task('js', function() {
  return gulp
    .src(['src/**/*.js', '!src/*/__tests__/*.*'])
    .pipe(urlLoader())
    .pipe(
      babel()
    )
    .pipe(gulp.dest('lib'));
});

// 编译index.js
gulp.task('js_index', function() {
  return gulp
    .src('src/index.tsx')
    .pipe(
      babel()
    )
    .pipe(gulp.dest('lib'));
});

// 编译index.js
gulp.task('js_style', function() {
  return gulp.src('src/style.js').pipe(gulp.dest('lib'));
});

// 编译scss为css
gulp.task('sass', function() {
  return (
    gulp
      .src('src/**/**/*.scss')
      // .pipe(
      //   base64({
      //     maxImageSize: 8 * 1024, // bytes
      //     debug: false
      //   })
      // )
      // TODO:: 取消sass的编译
      // .pipe(sass().on('error', sass.logError))
      // .pipe(
      //   rename(function(path) {
      //     if (path.basename === 'base') {
      //       return;
      //     }
      //     console.log(path);
      //     path.dirname = path.dirname + '\\style';
      //   })
      // )
      .pipe(gulp.dest('lib'))
  );
});
gulp.task('asset', function() {
  return gulp.src('src/**/*.@(png|jpg|jpeg)').pipe(gulp.dest('lib'));
});
// 最后打包
gulp.task(
  'build',
  gulp.series('clean', 'tsx', 'js', 'js_index', 'js_style', 'sass', 'asset', done => {
    done();
    console.log(chalk.green('Build lib successfully'));
  })
);
