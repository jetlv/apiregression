/**
 * Created by Administrator on 2017/3/21.
 */
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');

gulp.task('default', function() {
    gulp.watch(['milanoo/**'], ['mocha']);
});

gulp.task('mocha', function() {
    return gulp.src(['milanoo/**'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});
