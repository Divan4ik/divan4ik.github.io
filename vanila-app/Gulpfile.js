"use strict";

var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect');

var scratch = {
	less: [
      'less/normalize.less',
      'less/vars.less',
      'less/fonts.less',
      'less/mixins.less',
      'less/main.less',
      'less/form.less',
      'less/media.less',
    ],
	html: './index.html',
  js: [
      'js/core/EventBus.js',
      'js/core/Renderer.js',
      'js/ux/LoadingScreen.js',
      'js/services/StudentService.js',
      'js/Students.js',
      'js/services/AbonementService.js',
      'js/Abonements.js',
      'js/ux/Tabs.js',
      'js/ux/Search.js',
      'js/app.js',
    ],
};

gulp.task('less', function() {
  gulp.src(scratch.less)
    .pipe( concat('app.css') )
    .pipe( less() )
    .pipe( gulp.dest('css/') )
    .pipe( connect.reload() );
});

gulp.task('connect', function(){
	connect.server({
    port: 8000,
    livereload: true
  });
});

gulp.task('html', function(){
	gulp.src(scratch.html)
		.pipe(connect.reload());
});

gulp.task('js', function(){
  gulp.src(scratch.js)
    .pipe( concat('crm.js') )
    .pipe( gulp.dest('js/') )
    .pipe(connect.reload());
});

gulp.task('watch', function(){
	gulp.watch(scratch.less, ['less']);
  gulp.watch(scratch.html, ['html']);
	gulp.watch(scratch.js, ['js']);
})

gulp.task('default', ['connect', 'html', 'js', 'less', 'watch']);