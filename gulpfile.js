const gulp = require('gulp');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const cssnano = require('gulp-cssnano');
const { urlLoader } = require('gulp-url-loader');
const merge = require('merge2');

const paths = {
  dest: {
    lib: 'lib',
    esm: 'esm'
  },
  styles: 'src/**/**/*.scss',
  assets: 'src/**/*.@(png|jpg|jpeg)',
  scripts: ['src/index.tsx', 'src/**/*.{ts,tsx}', '!components/**/__tests__/*.{ts,tsx}']
};

const tsProject = ts.createProject('tsconfig.json', { declaration: true });

/**
 * 编译脚本文件
 * @param {string} babelEnv babel环境变量
 * @param {string} destDir 目标目录
 */
function compileScripts(babelEnv, destDir) {
  const { scripts } = paths;
  process.env.BABEL_ENV = babelEnv;
  const tsResult = gulp.src(scripts).pipe(urlLoader()).pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest(destDir)),
    tsResult.js.pipe(babel()).pipe(gulp.dest(destDir))
  ]);
}

/**
 * 编译cjs
 */
function compileCJS() {
  const { dest } = paths;
  return compileScripts('cjs', dest.lib);
}

/**
 * 编译esm
 */
function compileESM() {
  const { dest } = paths;
  return compileScripts('esm', dest.esm);
}

const buildScripts = gulp.series(compileCJS, compileESM);

/**
 * 拷贝scss文件
 */
function copyScss() {
  return gulp.src(paths.styles).pipe(gulp.dest(paths.dest.lib)).pipe(gulp.dest(paths.dest.esm));
}

/**
 * 拷贝静态资源
 */
function copyAsset() {
  return gulp.src(paths.assets).pipe(gulp.dest(paths.dest.lib)).pipe(gulp.dest(paths.dest.esm));
}

/**
 * 生成css文件
 */
function scssToCss() {
  return gulp
    .src(paths.styles)
    .pipe(sass())
    .pipe(cssnano({ zindex: false, reduceIdents: false })) // 压缩
    .pipe(gulp.dest(paths.dest.lib))
    .pipe(gulp.dest(paths.dest.esm));
}

const build = gulp.parallel(buildScripts, copyScss, scssToCss, copyAsset);

exports.build = build;

exports.default = build;
