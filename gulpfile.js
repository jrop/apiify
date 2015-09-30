// npm i --save-dev gulp gulp-print gulp-util rimraf

// Server JS
// npm i --save-dev gulp-babel

var gulp = require('gulp')
var gutil = require('gulp-util')

// Server JS
var babel = require('gulp-babel')

// Other
var print = require('gulp-print')
var rimraf = require('rimraf')

function tellerror(err) {
	console.error('ERROR', err.message)
	this.emit('end')
}

gulp.task('default', [ 'js' ])

gulp.task('js', function() {
	return gulp.src('src/**/*.js')
		.pipe(print())
		.pipe(babel({ stage: 1, optional: [ 'runtime' ] }))
		.on('error', tellerror)
		.pipe(gulp.dest('build'))
})

gulp.task('watch', [ 'default' ], function() {
	gulp.watch('src/**/*.js', [ 'js' ])
})

gulp.task('clean', function() {
	rimraf.sync('build')
})
