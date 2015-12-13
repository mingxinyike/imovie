var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch');

gulp.task('default',function(){
    livereload.listen();
    gulp.watch('./*.html').on('change',livereload.changed);
	gulp.watch('./page/*.html').on('change',livereload.changed);
    gulp.watch('./css/*.css').on('change',livereload.changed);
    gulp.watch('./js/*.js').on('change',livereload.changed);
});
