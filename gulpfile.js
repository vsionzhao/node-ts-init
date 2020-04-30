const { src, dest, watch, series, task } = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const alias = require('gulp-ts-alias');

function clean(cb) {
  return del(['dist'], cb);
}

// 输出 js 到 dist目录
function toJs() {
  return src('src/**/*.ts')
    .pipe(alias({configuration: tsProject.config}))
    .pipe(tsProject())
    .pipe(dest('dist'));
}


const dev = series(clean, toJs);
const build = series(clean, toJs);
exports.build = build;
exports.default = dev;
